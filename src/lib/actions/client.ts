"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getClients() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const clients = await prisma.client.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });
        return clients;
    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
}

export async function getClient(id: string) {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const client = await prisma.client.findFirst({
            where: { id, userId: session.user.id },
            include: {
                cases: {
                    orderBy: { updatedAt: "desc" },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        court: true,
                        status: true,
                        nextHearingDate: true,
                        updatedAt: true,
                    },
                },
            },
        });
        return client;
    } catch (error) {
        console.error("Error fetching client:", error);
        return null;
    }
}

export async function createClient(formData: FormData): Promise<void> {
    const session = await auth();
    console.log(session, "Session");
    if (!session?.user?.id) throw new Error("Unauthorized");


    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!name) throw new Error("Client name is required");

    try {
        await prisma.client.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                notes: notes || null,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Error creating client:", error);
        throw new Error("Failed to create client");
    }

    revalidatePath("/clients");
    redirect("/clients");
}
