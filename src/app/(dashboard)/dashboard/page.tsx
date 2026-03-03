import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Folder, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getCases } from "@/lib/actions/case";
import { QuickDraftDialog } from "@/components/dashboard/QuickDraftDialog";

export default async function DashboardPage() {
    const { totalClients, openCases, aiDrafts, totalCases } = await getDashboardStats();
    const cases = await getCases();

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Link href="/clients/new">
                        <Button variant="outline">New Client</Button>
                    </Link>
                    <Link href="/cases/new">
                        <Button>New Case Context</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClients}</div>
                        <p className="text-xs text-muted-foreground">Clients in your practice</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openCases}</div>
                        <p className="text-xs text-muted-foreground">Active matters</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Drafts Generated</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aiDrafts}</div>
                        <p className="text-xs text-muted-foreground">Across all case contexts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCases}</div>
                        <p className="text-xs text-muted-foreground">Lifetime cases in system</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Cases</CardTitle>
                        <CardDescription>Your recently accessed case workspaces.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {openCases === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                                <Folder className="h-8 w-8 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-sm font-medium">No cases yet</h3>
                                <p className="text-xs text-muted-foreground mt-1">Create your first case to get started.</p>
                                <Link href="/cases/new" className="mt-4">
                                    <Button variant="outline" size="sm">New Case</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                                <Link href="/cases">
                                    <Button variant="link">View all {openCases} open cases →</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Draft</CardTitle>
                        <CardDescription>Jump straight into creating a new document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <QuickDraftDialog
                            cases={cases}
                            triggerText="Draft Legal Notice"
                            defaultDraftType="Legal Notice"
                        />
                        <QuickDraftDialog
                            cases={cases}
                            triggerText="Draft Bail Application"
                            defaultDraftType="Bail Application"
                        />
                        <QuickDraftDialog
                            cases={cases}
                            triggerText="Draft Written Statement"
                            defaultDraftType="Written Statement"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
