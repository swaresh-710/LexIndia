"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCases() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const cases = await prisma.case.findMany({
            where: { userId: session.user.id },
            include: {
                client: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return cases;
    } catch (error) {
        console.error("Error fetching cases:", error);
        return [];
    }
}

export async function getCase(id: string) {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const caseDetails = await prisma.case.findUnique({
            where: { id, userId: session.user.id },
            include: {
                client: true,
                messages: {
                    orderBy: { createdAt: "asc" }
                },
                documents: {
                    orderBy: { createdAt: "desc" }
                },
                tasks: {
                    orderBy: [
                        { status: "asc" },
                        { dueDate: "asc" }
                    ]
                }
            },
        });
        return caseDetails;
    } catch (error) {
        console.error("Error fetching case details:", error);
        return null;
    }
}

export async function createCase(formData: FormData): Promise<void> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const court = formData.get("court") as string;
    const clientId = formData.get("clientId") as string;
    const facts = formData.get("facts") as string;
    const nextHearingDateStr = formData.get("nextHearingDate") as string;

    const nextHearingDate = nextHearingDateStr ? new Date(nextHearingDateStr) : null;

    if (!title || !type || !clientId) throw new Error("Missing required fields");

    try {
        await prisma.case.create({
            data: {
                title,
                type,
                clientId,
                userId: session.user.id,
                court: court || null,
                status: "OPEN",
                facts: facts || null,
                nextHearingDate: nextHearingDate,
            },
        });
    } catch (error) {
        console.error("Error creating case:", error);
        throw new Error("Failed to create case");
    }

    revalidatePath("/cases");
    redirect("/cases");
}

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return { totalClients: 0, openCases: 0, aiDrafts: 0 };

    const userId = session.user.id;

    try {
        const [totalClients, openCases, aiDrafts] = await Promise.all([
            prisma.client.count({ where: { userId } }),
            prisma.case.count({ where: { userId, status: "OPEN" } }),
            prisma.document.count({ where: { case: { userId }, type: "AI_GENERATED" } }),
        ]);

        return { totalClients, openCases, aiDrafts };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { totalClients: 0, openCases: 0, aiDrafts: 0 };
    }
}
