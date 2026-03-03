import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { caseId, draftType, instructions, facts, documents } = await req.json();

        // Compile document context
        let documentContext = "";
        if (documents && documents.length > 0) {
            documentContext = "Here are the attached documents for reference:\n\n";
            documents.forEach((doc: any, i: number) => {
                documentContext += `--- Document ${i + 1}: ${doc.name} ---\n${doc.content}\n\n`;
            });
        }

        const systemPrompt = `You are LexAI, a highly specialized and experienced Indian legal advocate. Your task is to draft a formal legal document.

DOCUMENT TYPE TO DRAFT: ${draftType}

CASE FACTS:
${facts || "No specific facts provided."}

${documentContext}

SPECIFIC INSTRUCTIONS FROM LAWYER:
${instructions || "Follow standard Indian legal format."}

CRITICAL FORMATTING INSTRUCTIONS (STRICT ADHERENCE REQUIRED):
1. **Jurisdiction & Court Name:** Begin with the correct court heading (e.g., "IN THE COURT OF THE CIVIL JUDGE, [CITY]", "IN THE HIGH COURT OF JUDICATURE AT [CITY]", "IN THE SUPREME COURT OF INDIA").
2. **Cause Title:** Include placeholder names for Petitioner/Plaintiff vs. Respondent/Defendant if not explicitly provided in the facts. (e.g., "A.B. ... Plaintiff / VERSUS / C.D. ... Defendant").
3. **Draft Structure:** The document MUST follow the standard structure for Indian courts (e.g., "SUIT FOR INJUNCTION", "APPLICATION UNDER SECTION 439 OF Cr.P.C. FOR REGULAR BAIL").
4. **Numbered Paragraphs:** All substantive claims, facts, and arguments MUST be in clearly numbered paragraphs.
5. **Legal Citations (India):** Where applicable, cite Indian statutes correctly (e.g., "s. 138 of the Negotiable Instruments Act, 1881", "O. 39 R. 1 & 2 of the Code of Civil Procedure, 1908").
6. **Tone:** Professional, formal legal English typical of Indian courts. Avoid colloquialisms.
7. **Prayer/Relief:** Conclude with a clear "PRAYER" or "RELIEF SOUGHT" section stating exactly what the applicant/plaintiff is asking the court to do.
8. **Verification:** Add a standard Verification block at the end (e.g., "Verified at [City] on this [Date] day of [Month, Year] that the contents of paras 1 to X are true to my knowledge...").

Do not include any conversational filler. Start the legal formatted document immediately. Format using Markdown.`;

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
        const promptText = `${systemPrompt}\n\nUser: Please draft the ${draftType} based on the provided facts and instructions.`;

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-3-flash-preview",
            contents: promptText,
        });

        let fullText = "";
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of responseStream) {
                        if (chunk.text) {
                            fullText += chunk.text;
                            controller.enqueue(encoder.encode(chunk.text));
                        }
                    }

                    // Once finished, save this as an official document in the case
                    if (caseId && fullText) {
                        try {
                            await prisma.document.create({
                                data: {
                                    name: `AI Draft - ${draftType}`,
                                    type: "AI_GENERATED",
                                    content: fullText,
                                    url: null,
                                    caseId: caseId,
                                }
                            });
                        } catch (e) {
                            console.error("Failed to save draft to case documents:", e);
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            }
        });
    } catch (error) {
        console.error("Draft API Error:", error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
