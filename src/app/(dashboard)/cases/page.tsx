import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCases } from "@/lib/actions/case";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function CasesPage() {
    const cases = await getCases();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
                    <p className="text-muted-foreground">Manage your legal matters and open cases.</p>
                </div>
                <Link href="/cases/new">
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Case Context
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Cases</CardTitle>
                            <CardDescription>A list of all cases you are currently handling.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search cases..."
                                className="pl-8 bg-background"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {cases.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                            <h3 className="text-lg font-semibold">No cases yet</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                You haven&apos;t added any case matters yet.
                            </p>
                            <Link href="/cases/new">
                                <Button variant="outline">Create your first case</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Case Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Court</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Next Hearing</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Updated</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground"></th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {cases.map((c) => (
                                        <tr key={c.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{c.title}</td>
                                            <td className="p-4 align-middle">{c.client?.name || "Unknown"}</td>
                                            <td className="p-4 align-middle">{c.type}</td>
                                            <td className="p-4 align-middle">
                                                <span className="text-muted-foreground">{c.court || "—"}</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {c.nextHearingDate ? (
                                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                        {new Date(c.nextHearingDate).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                                                    ${c.status === 'OPEN' ? 'bg-primary/10 text-primary' :
                                                        c.status === 'CLOSED' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-muted text-muted-foreground'}`}>
                                                    {c.status}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(c.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Link href={`/cases/${c.id}`}>
                                                    <Button variant="ghost" size="sm">Workspace</Button>
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
