"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { updateCaseFacts } from "@/lib/actions/case";
import { useRouter } from "next/navigation";

interface CaseFactsEditorProps {
    caseId: string;
    initialFacts?: string | null;
}

export function CaseFactsEditor({ caseId, initialFacts }: CaseFactsEditorProps) {
    const [open, setOpen] = useState(false);
    const [facts, setFacts] = useState(initialFacts || "");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateCaseFacts(caseId, facts);
        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Context
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Case Facts & Context</DialogTitle>
                    <DialogDescription>
                        Update the fundamental background facts of this case. The AI uses this context to provide accurate legal reasoning.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Textarea
                        id="facts"
                        value={facts}
                        onChange={(e) => setFacts(e.target.value)}
                        placeholder="Description of the situation, incident dates, specific parties involved, and key contextual background... This heavily guides LexAI."
                        className="col-span-4 min-h-[250px] resize-y"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
