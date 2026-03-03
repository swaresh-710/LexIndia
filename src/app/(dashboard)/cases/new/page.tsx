import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCase } from "@/lib/actions/case";
import { getClients } from "@/lib/actions/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewCasePage() {
    const clients = await getClients();

    if (clients.length === 0) {
        // Must have at least one client to create a case
        redirect("/clients/new?message=You must create a client before assigning a case");
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Link href="/cases">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Case Context</h1>
                    <p className="text-muted-foreground">Setup a workspace for a specific legal matter.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Case Details</CardTitle>
                    <CardDescription>
                        Assign this case to a client and define its parameters.
                    </CardDescription>
                </CardHeader>
                <form action={createCase}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Case Title <span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" placeholder="E.g., Sharma Property Dispute vs DDA" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientId">Client <span className="text-red-500">*</span></Label>
                            <select
                                id="clientId"
                                name="clientId"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled selected>Select a client...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Case Type <span className="text-red-500">*</span></Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="Civil">Civil</option>
                                    <option value="Criminal">Criminal</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Family">Family</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="court">Court Details</Label>
                                <Input id="court" name="court" placeholder="E.g., Delhi High Court" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nextHearingDate">Next Hearing Date</Label>
                            <Input id="nextHearingDate" name="nextHearingDate" type="date" className="block" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facts">Brief Facts & Notes</Label>
                            <textarea
                                id="facts"
                                name="facts"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Summary of the situation, relevant dates, and key context... This helps the AI context!"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Link href="/cases">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit">Create Workspace</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
