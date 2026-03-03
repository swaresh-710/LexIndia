import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCase } from "@/lib/actions/case";
import { ArrowLeft, Calendar, FileText, Download } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DocumentUploadButton } from "@/components/case/DocumentUploadButton";
import { DocumentDownloadButton } from "@/components/case/DocumentDownloadButton";
import { ChatInterface } from "@/components/case/ChatInterface";
import { NotesSection } from "@/components/case/NotesSection";
import { CaseFactsEditor } from "@/components/case/CaseFactsEditor";

export const dynamic = "force-dynamic";

export default async function CaseDetailsPage({ params }: { params: { id: string } }) {
    const caseDetails = await getCase(params.id);

    if (!caseDetails) {
        redirect("/cases");
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/cases">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{caseDetails.title}</h1>
                    <p className="text-muted-foreground">
                        {caseDetails.type} Case • Client: {caseDetails.client?.name}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Court</p>
                                    <p>{caseDetails.court || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Next Hearing</p>
                                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        {caseDetails.nextHearingDate
                                            ? new Date(caseDetails.nextHearingDate).toLocaleDateString()
                                            : "Not scheduled"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground font-medium">Brief Facts</p>
                                    <CaseFactsEditor caseId={caseDetails.id} initialFacts={caseDetails.facts} />
                                </div>
                                <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
                                    {caseDetails.facts || "No facts recorded for this case."}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Case Context & Documents</CardTitle>
                                <CardDescription>Files attached to this case. Text files will be read by the AI.</CardDescription>
                            </div>
                            <DocumentUploadButton caseId={caseDetails.id} />
                        </CardHeader>
                        <CardContent>
                            {caseDetails.documents && caseDetails.documents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    {caseDetails.documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-start justify-between gap-3 p-3 border rounded-md bg-muted/20">
                                            <div className="flex items-start gap-3 flex-1 overflow-hidden">
                                                <div className="bg-primary/10 p-2 rounded text-primary">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">
                                                            {doc.type === "AI_GENERATED" ? "AI Draft" : "Uploaded"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(doc.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0">
                                                <DocumentDownloadButton document={doc} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed mt-4">
                                    <FileText className="h-8 w-8 text-muted-foreground mb-4 opacity-50" />
                                    <h3 className="text-sm font-medium">No documents uploaded</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                                        Upload evidence, text files, or chat with the AI to generate new documents here.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI Chatbot Area */}
                    <div className="pt-4">
                        <ChatInterface
                            key={caseDetails.id}
                            caseId={caseDetails.id}
                            facts={caseDetails.facts || ""}
                            documents={caseDetails.documents.map((d: any) => ({
                                name: d.name,
                                content: d.content
                            }))}
                            initialMessages={caseDetails.messages?.map((m: any) => ({
                                id: m.id,
                                role: m.role as "user" | "assistant" | "system",
                                content: m.content,
                                parts: [{ type: "text" as const, text: m.content }]
                            })) || []}
                        />
                    </div>

                    <div className="pt-2">
                        <NotesSection caseId={caseDetails.id} initialNotes={caseDetails.notes || []} />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold
                                ${caseDetails.status === 'OPEN' ? 'bg-primary/10 text-primary' :
                                    caseDetails.status === 'CLOSED' ? 'bg-red-500/10 text-red-500' :
                                        'bg-muted text-muted-foreground'}`}>
                                {caseDetails.status}
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Created: {new Date(caseDetails.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Last Updated: {new Date(caseDetails.updatedAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Case Tasks</CardTitle>
                            <CardDescription>Pending tasks mapped to this matter.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {caseDetails.tasks && caseDetails.tasks.length > 0 ? (
                                <div className="space-y-3">
                                    {caseDetails.tasks.map((task: any) => (
                                        <div key={task.id} className="flex justify-between items-start text-sm border-b pb-2 last:border-0 last:pb-0">
                                            <div className="space-y-1">
                                                <p className={`font-medium ${task.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>
                                                    {task.title}
                                                </p>
                                                {task.dueDate && (
                                                    <p className="text-xs text-orange-600 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No tasks found.</p>
                            )}
                            <div className="mt-4 pt-4 border-t">
                                <Link href="/tasks">
                                    <Button variant="link" className="w-full text-xs">Manage all tasks ➔</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
