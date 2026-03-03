"use client";

import { useState } from "react";
import { addNote, deleteNote } from "@/lib/actions/note";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, Plus, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";

interface Note {
    id: string;
    content: string;
    createdAt: Date;
    isOcr: boolean;
}

interface NotesSectionProps {
    caseId: string;
    initialNotes?: Note[];
}

export function NotesSection({ caseId, initialNotes = [] }: NotesSectionProps) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [newNote, setNewNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const result = await addNote(caseId, newNote.trim());
        if (result.success) {
            setNewNote("");
            router.refresh();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        const result = await deleteNote(caseId, noteId);
        if (result.success) {
            setNotes(notes.filter(n => n.id !== noteId));
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <Card className="flex flex-col border-primary/20 shadow-sm mt-6">
            <CardHeader className="bg-primary/5 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <StickyNote className="h-5 w-5 text-primary" />
                            Lawyer Notes
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Private workspace notes and arguments for this case.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {notes.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
                        <StickyNote className="h-6 w-6 mx-auto mb-2 opacity-30" />
                        No notes added yet.
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {notes.map((note) => (
                            <div key={note.id} className="relative p-3 bg-muted/30 border rounded-lg group">
                                <p className="text-sm whitespace-pre-wrap pr-8">{note.content}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-muted-foreground bg-background px-1.5 rounded border">
                                        {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                    {note.isOcr && (
                                        <span className="text-[10px] text-indigo-500 bg-indigo-50 border-indigo-200 px-1.5 rounded border">
                                            OCR Extracted
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteNote(note.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 border-t bg-muted/10">
                <form onSubmit={handleAddNote} className="flex flex-col w-full gap-2">
                    <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add your legal notes, observations, or argument points..."
                        className="flex-1 bg-background min-h-[80px] text-sm resize-none"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" size="sm" disabled={isSubmitting || !newNote.trim()} className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            {isSubmitting ? "Saving..." : "Save Note"}
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    );
}
