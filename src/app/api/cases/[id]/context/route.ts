import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const caseData = await prisma.case.findUnique({
            where: { id: params.id, userId: session.user.id },
            include: {
                documents: {
                    where: {
                        content: { not: null },
                    },
                    select: {
                        name: true,
                        content: true,
                    }
                },
            },
        });

        if (!caseData) {
            return new Response("Not found", { status: 404 });
        }

        return new Response(JSON.stringify({
            facts: caseData.facts,
            documents: caseData.documents,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching case context:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
