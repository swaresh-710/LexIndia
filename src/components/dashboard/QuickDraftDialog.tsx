"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileSignature } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you have sonner, if not we'll use a simple alert or standard Shadcn toast

interface QuickDraftDialogProps {
    cases: { id: string; title: string; client?: { name: string } }[];
    triggerText: string;
    defaultDraftType: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
}

export function QuickDraftDialog({ cases, triggerText, defaultDraftType, variant = "outline", className }: QuickDraftDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [instructions, setInstructions] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCaseId) {
            alert("Please select a case.");
            return;
        }

        setIsGenerating(true);
        try {
            // First we need to get facts and docs for the case
            const res = await fetch(`/api/cases/${selectedCaseId}/context`);
            const contextData = await res.json();

            // Then we send it to the draft API
            const draftRes = await fetch("/api/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caseId: selectedCaseId,
                    draftType: defaultDraftType,
                    instructions: instructions,
                    facts: contextData.facts,
                    documents: contextData.documents,
                }),
            });

            if (!draftRes.ok) throw new Error("Failed to generate draft");

            // Wait for the stream to finish 
            // Since our API currently streams using ai-sdk, we can just read the response text
            // In a real app we might show the stream, but for "Quick Draft" we wait and redirect

            const reader = draftRes.body?.getReader();
            const decoder = new TextDecoder();
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    // We don't need to do anything with the chunks here because the API route
                    // saves the final document to the DB onFinish.
                    // We just consume the stream to know it finished.
                }
            }

            setOpen(false);
            setInstructions("");
            setSelectedCaseId("");

            // Give the DB a tiny moment to save before redirecting
            setTimeout(() => {
                router.push(`/cases/${selectedCaseId}`);
                router.refresh();
            }, 500);

        } catch (error) {
            console.error(error);
            alert("An error occurred while generating the draft.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} className={className || "w-full justify-start gap-2"}>
                    <FileSignature className="h-4 w-4" />
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Draft {defaultDraftType}</DialogTitle>
                    <DialogDescription>
                        The AI will generate a draft strictly following Indian legal formats based on the selected case context.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGenerate} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="case-select">Select Case Context</Label>
                        <Select value={selectedCaseId} onValueChange={setSelectedCaseId} required disabled={isGenerating}>
                            <SelectTrigger id="case-select">
                                <SelectValue placeholder="Select a case..." />
                            </SelectTrigger>
                            <SelectContent>
                                {cases.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.title} {c.client?.name ? `(${c.client.name})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions">Specific Instructions (Optional)</Label>
                        <Textarea
                            id="instructions"
                            placeholder="E.g., Make the tone very strict. Emphasize section 138 of NI Act."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            disabled={isGenerating}
                            className="resize-none h-24"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating & Saving...
                            </>
                        ) : (
                            "Generate Draft"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
