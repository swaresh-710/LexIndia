import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        console.log("=== START CHAT API REQUEST ===");
        const body = await req.json();
        console.log("Received Request Body Keys:", Object.keys(body));
        const { messages, caseId, facts, documents } = body;
        console.log(`Parsed Body: ${messages?.length} messages, caseId: ${caseId}, ${documents?.length} documents`);

        // Compile document context
        let documentContext = "";
        if (documents && documents.length > 0) {
            documentContext = "Here are the attached documents for context:\n\n";
            documents.forEach((doc: any, i: number) => {
                documentContext += `--- Document ${i + 1}: ${doc.name} ---\n${doc.content}\n\n`;
            });
        }

        const systemPrompt = `You are LexAI, a highly specialized Indian legal assistant advocate. You help draft legal notices, analyze facts, and organize case evidence.

CASE FACTS:
${facts || "No facts provided yet."}

${documentContext}

INSTRUCTIONS:
- Base your answers strictly on the provided Case Facts and Documents.
- When providing legal analysis, arguments, or advice, you MUST cite specific sections of Indian Law (e.g., IPC, CrPC, BNS, BSA, CPC, specific Acts) and relevant landmark judgments from the Supreme Court of India or High Courts. If a relevant citation applies, include it clearly with sufficient detail.
- If drafting a formal notice or document, use standard Indian legal formatting.
- If asked to summarize, be professional and concise.
- If you don't know the answer or the context doesn't contain it, say so clearly.`;

        // Normalize UIMessage to CoreMessage
        console.log("Normalizing Messages...");
        const coreMessages = (messages as any[]).map((msg) => {
            const role = msg.role === "assistant" ? "assistant" as const : msg.role === "system" ? "system" as const : "user" as const;
            let content = "";
            if (Array.isArray(msg.parts)) {
                content = (msg.parts as any[]).filter((p) => p.type === "text").map((p) => p.text ?? "").join("");
            } else {
                content = String(msg.content ?? "");
            }
            return { role, content };
        }).filter((m) => m.content.length > 0);
        console.log("Core Messages Count:", coreMessages.length);
        console.log("Last Message Role:", coreMessages[coreMessages.length - 1]?.role);

        // Save last user message (non-blocking)
        const lastUser = coreMessages[coreMessages.length - 1];
        if (caseId && lastUser?.role === "user") {
            console.log(`Saving User Message for Case ID: ${caseId}`);
            prisma.message.create({ data: { role: "user", content: lastUser.content, caseId } })
                .then(() => console.log("User Message Saved Successfully"))
                .catch((e) => console.error("Prisma User Message Save Error:", e));
        }

        console.log("Initializing Google Gen AI Model...");
        const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

        console.log("Starting streamText...");

        const result = streamText({
            model: google("gemini-3-flash-preview"),
            system: systemPrompt,
            messages: coreMessages,
            onFinish: async ({ text }) => {
                console.log("streamText onFinish Triggered - Response Length:", text?.length || 0);
                if (caseId && text) {
                    prisma.message.create({ data: { role: "assistant", content: text, caseId } })
                        .catch((e) => console.error("Prisma Assistant Save Error:", e));
                }
            },
            onError: (error) => {
                console.error("streamText onError:", error);
            }
        });

        console.log("Returning result.toUIMessageStreamResponse()...");
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
