"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const caseId = formData.get("caseId") as string;

    if (!file || !caseId) {
        throw new Error("Missing file or case ID");
    }

    try {
        let content: string | null = null;

        if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            // Plain text — read directly
            content = await file.text();
        } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            // PDF — extract text using pdf-parse (ESM export, called directly)
            try {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const pdfParse = await import("pdf-parse") as unknown as (buf: Buffer) => Promise<{ text: string }>;
                const pdfData = await pdfParse(buffer);
                content = pdfData.text || null;
            } catch (pdfError) {
                console.error("Failed to parse PDF:", pdfError);
                // Still save the document entry, just without extractable text
                content = null;
            }
        }

        const doc = await prisma.document.create({
            data: {
                name: file.name,
                type: file.type || "UNKNOWN",
                content: content,
                url: `/uploads/${file.name}`, // Placeholder for actual upload path
                caseId: caseId,
            }
        });

        revalidatePath(`/cases/${caseId}`);
        return { success: true, document: doc };
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload document");
    }
}

export async function saveGeneratedDocument(caseId: string, title: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const doc = await prisma.document.create({
            data: {
                name: title,
                type: "AI_GENERATED",
                content: content,
                url: null,
                caseId: caseId,
            }
        });

        revalidatePath(`/cases/${caseId}`);
        return { success: true, document: doc };
    } catch (error) {
        console.error("Save generated document error:", error);
        throw new Error("Failed to save document");
    }
}
