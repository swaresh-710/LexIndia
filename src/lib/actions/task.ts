"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getTasks() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const tasks = await prisma.task.findMany({
            where: { userId: session.user.id },
            include: {
                case: {
                    select: { title: true }
                }
            },
            orderBy: [
                { status: "asc" },
                { dueDate: "asc" }
            ],
        });
        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

export async function createTask(formData: FormData): Promise<void> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDateStr = formData.get("dueDate") as string;
    const caseId = formData.get("caseId") as string;

    if (!title) throw new Error("Task title is required");

    const dueDate = dueDateStr ? new Date(dueDateStr) : null;

    try {
        await prisma.task.create({
            data: {
                title,
                description: description || null,
                dueDate,
                caseId: caseId || null,
                userId: session.user.id,
                status: "TODO",
            },
        });
    } catch (error) {
        console.error("Error creating task:", error);
        throw new Error("Failed to create task");
    }

    revalidatePath("/tasks");
}

export async function toggleTaskStatus(taskId: string, currentStatus: string): Promise<void> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const newStatus = currentStatus === "TODO" ? "DONE" : "TODO";

    try {
        await prisma.task.update({
            where: { id: taskId, userId: session.user.id },
            data: { status: newStatus },
        });
    } catch (error) {
        console.error("Error toggling task status:", error);
        throw new Error("Failed to update task status");
    }

    revalidatePath("/tasks");
}
