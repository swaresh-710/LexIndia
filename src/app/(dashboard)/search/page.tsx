import { Suspense } from "react";
import { Search, Folder, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || "";

    let clients: any[] = [];
    let cases: any[] = [];

    if (query) {
        clients = await prisma.client.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                ]
            },
            take: 10
        });

        cases = await prisma.case.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { court: { contains: query, mode: "insensitive" } },
                ]
            },
            include: { client: true },
            take: 10
        });
    }

    const hasResults = clients.length > 0 || cases.length > 0;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
            </div>

            <div className="flex flex-col gap-6 mt-6">
                {!query && (
                    <div className="rounded-md border p-8 text-center bg-card">
                        <Search className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Search Query</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Please enter a search term in the top search bar to find clients or cases.
                        </p>
                    </div>
                )}

                {query && !hasResults && (
                    <div className="rounded-md border p-8 text-center bg-card">
                        <Search className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No results found for &quot;{query}&quot;</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                            Try adjusting your search terms or checking for typos.
                        </p>
                    </div>
                )}

                {query && hasResults && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Clients Results */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-xl font-semibold">Clients ({clients.length})</h3>
                            </div>
                            {clients.length > 0 ? (
                                <div className="grid gap-4">
                                    {clients.map((client) => (
                                        <Link key={client.id} href={`/clients/${client.id}`}>
                                            <Card className="hover:bg-accent transition-colors">
                                                <CardContent className="p-4">
                                                    <div className="font-medium text-lg">{client.name}</div>
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {client.email || 'No email provided'} • {client.phone || 'No phone provided'}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No matching clients.</p>
                            )}
                        </div>

                        {/* Cases Results */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Folder className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-xl font-semibold">Cases ({cases.length})</h3>
                            </div>
                            {cases.length > 0 ? (
                                <div className="grid gap-4">
                                    {cases.map((caseItem) => (
                                        <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                                            <Card className="hover:bg-accent transition-colors">
                                                <CardContent className="p-4">
                                                    <div className="font-medium text-lg">{caseItem.title}</div>
                                                    <div className="text-sm text-muted-foreground mb-1">
                                                        {caseItem.type} Case • {caseItem.status}
                                                    </div>
                                                    {caseItem.client && (
                                                        <div className="text-xs text-muted-foreground bg-muted inline-flex px-2 py-1 rounded-md">
                                                            Client: {caseItem.client.name}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No matching cases.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
