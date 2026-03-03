"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, FileText, Bot, User, Loader2, Save } from "lucide-react";
import { saveGeneratedDocument } from "@/lib/actions/document";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
    caseId: string;
    facts: string;
    documents: { name: string; content: string | null }[];
    initialMessages?: UIMessage[];
}

export function ChatInterface({ caseId, facts, documents, initialMessages }: ChatInterfaceProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Filter to only text documents that the AI can read
    const readableDocs = documents.filter(d => d.content);

    const { messages, sendMessage, status } = useChat({
        id: `chat-${caseId}`,
        // @ts-ignore - UIMessage generic inference breaks 'api' property typing in some versions
        api: "/api/chat",
        body: {
            caseId,
            facts,
            documents: readableDocs,
        },
        initialMessages: initialMessages && initialMessages.length > 0 ? initialMessages : [
            {
                id: "welcome",
                role: "assistant" as const,
                content: "Hello! I am your Legal AI Assistant. I have read the facts of this case and any attached text documents. How can I help you today? I can draft notices, summarize evidence, or answer questions.",
            },
        ],
    });

    const isLoading = status === "streaming" || status === "submitted";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        const text = inputValue;
        setInputValue("");
        await sendMessage({ text }, {
            body: {
                caseId,
                facts,
                documents: readableDocs,
            }
        });
    };

    // Get text from message — handles both content string and parts array formats
    const getMessageText = (m: any): string => {
        if (typeof m.content === "string" && m.content) return m.content;
        if (Array.isArray(m.parts)) {
            return m.parts
                .filter((p: any) => p.type === "text")
                .map((p: any) => p.text ?? "")
                .join("");
        }
        return "";
    };

    const handleSaveAsDocument = async (content: string) => {
        setIsSaving(true);
        try {
            const title = prompt("Enter a title for this new document:", "AI Generated Draft");
            if (!title) return;

            await saveGeneratedDocument(caseId, title, content);
            alert("Success! Document saved to your case workspace.");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save the document.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="flex flex-col h-[600px] border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="h-5 w-5 text-primary" />
                    Case AI Assistant
                </CardTitle>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                        <FileText className="h-3 w-3" />
                        Facts Loaded
                    </span>
                    <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                        <FileText className="h-3 w-3" />
                        {readableDocs.length} Documents Context
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                    const text = getMessageText(m);
                    const role = String(m.role); // cast to string — SDK types role as a literal union
                    return (
                        <div key={m.id} className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                {role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`flex flex-col gap-2 max-w-[80%] ${role === "user" ? "items-end" : "items-start"}`}>
                                <div className={`p-3 rounded-lg text-sm ${role === "user"
                                    ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                                    : "bg-muted border border-border/50 overflow-hidden"
                                    }`}>
                                    {role === "user" ? (
                                        text
                                    ) : (
                                        <div className="space-y-2">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    code: ({ node, className, children, ...props }: any) => {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        const isInline = !match && !String(children).includes('\n');
                                                        return isInline ? (
                                                            <code className="bg-background/80 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <div className="overflow-x-auto bg-background/80 rounded-md p-3 my-2 text-xs font-mono border border-border/50">
                                                                <code {...props}>{children}</code>
                                                            </div>
                                                        );
                                                    }
                                                }}
                                            >
                                                {text}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {role === "assistant" && text.length > 200 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs gap-1 opacity-70 hover:opacity-100"
                                        onClick={() => handleSaveAsDocument(text)}
                                        disabled={isSaving || isLoading}
                                    >
                                        <Save className="h-3 w-3" />
                                        Save to Documents
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                            <Bot className="h-4 w-4 animate-pulse" />
                        </div>
                        <div className="p-3 rounded-lg text-sm bg-muted border border-border/50 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            Thinking...
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 border-t bg-muted/10">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask the AI to draft a notice or analyze evidence..."
                        className="flex-1 bg-background"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
