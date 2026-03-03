import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/lib/actions/client";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Manage your clients and their contact information.</p>
                </div>
                <Link href="/clients/new">
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Client
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Clients</CardTitle>
                            <CardDescription>A list of all clients across your practice.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search clients..."
                                className="pl-8 bg-background"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                            <h3 className="text-lg font-semibold">No clients yet</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                You haven&apos;t added any clients to your practice yet.
                            </p>
                            <Link href="/clients/new">
                                <Button variant="outline">Add your first client</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Added On</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground"></th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{client.name}</td>
                                            <td className="p-4 align-middle">{client.email || "-"}</td>
                                            <td className="p-4 align-middle">{client.phone || "-"}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(client.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Link href={`/clients/${client.id}`}>
                                                    <Button variant="ghost" size="sm">View →</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
