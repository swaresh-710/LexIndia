"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentDownloadButtonProps {
    document: {
        id: string;
        name: string;
        content: string | null;
        url: string | null;
        type: string;
    };
}

export function DocumentDownloadButton({ document }: DocumentDownloadButtonProps) {
    const handleDownload = () => {
        if (document.content) {
            // It's a text-based or AI generated document stored in DB
            const blob = new Blob([document.content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = window.document.createElement("a");
            a.href = url;
            a.download = document.name.endsWith(".md") || document.name.endsWith(".txt")
                ? document.name
                : `${document.name}.md`;
            window.document.body.appendChild(a);
            a.click();
            window.document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (document.url) {
            // It's an uploaded file with a URL
            const a = window.document.createElement("a");
            a.href = document.url;
            a.download = document.name;
            a.target = "_blank"; // In case it cannot be downloaded directly
            window.document.body.appendChild(a);
            a.click();
            window.document.body.removeChild(a);
        } else {
            alert("No content available to download.");
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={handleDownload}
            title="Download Document"
        >
            <Download className="h-4 w-4" />
        </Button>
    );
}
