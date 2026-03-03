"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addNote(caseId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.note.create({
            data: {
                content,
                caseId,
            }
        });
        revalidatePath(`/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Error creating note:", error);
        return { success: false, error: "Failed to create note." };
    }
}

export async function deleteNote(caseId: string, noteId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.note.delete({
            where: { id: noteId, case: { userId: session.user.id } }
        });
        revalidatePath(`/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting note:", error);
        return { success: false, error: "Failed to delete note." };
    }
}
