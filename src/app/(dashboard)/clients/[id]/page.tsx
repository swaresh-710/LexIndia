import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClient } from "@/lib/actions/client";
import { ArrowLeft, Briefcase, Calendar, Mail, Phone, StickyNote, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
    const client = await getClient(params.id);

    if (!client) {
        redirect("/clients");
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                    <p className="text-muted-foreground">
                        Client since {new Date(client.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/cases/new?clientId=${client.id}`}>
                        <Button className="gap-2">
                            <Briefcase className="h-4 w-4" />
                            New Case
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-primary" />
                                Contact Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {client.email ? (
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</p>
                                        <a href={`mailto:${client.email}`} className="text-sm hover:underline text-primary">
                                            {client.email}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground">No email on record</p>
                                </div>
                            )}

                            {client.phone ? (
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Phone</p>
                                        <a href={`tel:${client.phone}`} className="text-sm hover:underline text-primary">
                                            {client.phone}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground">No phone on record</p>
                                </div>
                            )}

                            {client.notes && (
                                <div className="flex items-start gap-3 pt-2 border-t">
                                    <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Notes</p>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{client.notes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary">{client.cases.length}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {client.cases.length === 1 ? "Active Matter" : "Total Matters"}
                                </p>
                            </div>
                            <div className="flex justify-center gap-4 mt-4 text-center">
                                <div>
                                    <p className="font-semibold text-sm">
                                        {client.cases.filter(c => c.status === "OPEN").length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Open</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">
                                        {client.cases.filter(c => c.status === "CLOSED").length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Closed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cases Table */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Cases
                            </CardTitle>
                            <CardDescription>All legal matters for {client.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {client.cases.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-10 text-center border rounded-lg border-dashed">
                                    <Briefcase className="h-8 w-8 text-muted-foreground mb-3 opacity-40" />
                                    <h3 className="text-sm font-semibold">No cases yet</h3>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                                        This client has no matters on file.
                                    </p>
                                    <Link href={`/cases/new?clientId=${client.id}`}>
                                        <Button variant="outline" size="sm">Open a Case</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Case Title</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Court</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Next Hearing</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {client.cases.map((c) => (
                                                <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium">{c.title}</td>
                                                    <td className="p-4 align-middle text-muted-foreground">{c.type}</td>
                                                    <td className="p-4 align-middle">
                                                        <span className="text-muted-foreground">{c.court || "—"}</span>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {c.nextHearingDate ? (
                                                            <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 text-xs">
                                                                <Calendar className="h-3 w-3" />
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
                                                    <td className="p-4 align-middle text-right">
                                                        <Link href={`/cases/${c.id}`}>
                                                            <Button variant="ghost" size="sm">Workspace →</Button>
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
            </div>
        </div>
    );
}
