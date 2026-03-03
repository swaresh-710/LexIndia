import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/actions/client";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
                    <p className="text-muted-foreground">Add a new client to your practice.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Client Information
                    </CardTitle>
                    <CardDescription>
                        Fill in the details for your new client. Only the name is required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createClient} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Ramesh Kumar"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-muted-foreground font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="ramesh@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone <span className="text-muted-foreground font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">
                                Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={4}
                                placeholder="Any relevant background information about this client..."
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="flex-1">
                                Create Client
                            </Button>
                            <Link href="/clients">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
