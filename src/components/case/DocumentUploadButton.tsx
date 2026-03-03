"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { uploadDocument } from "@/lib/actions/document";
import { useRouter } from "next/navigation";

export function DocumentUploadButton({ caseId }: { caseId: string }) {
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("caseId", caseId);

            await uploadDocument(formData);
            router.refresh();
        } catch (error) {
            console.error("Failed to upload:", error);
            alert("Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset the input
            e.target.value = '';
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                id="doc-upload"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg"
            />
            <label htmlFor="doc-upload">
                <Button size="sm" variant="outline" className="gap-2 cursor-pointer" asChild disabled={isUploading}>
                    <span>
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isUploading ? "Uploading..." : "Upload Document"}
                    </span>
                </Button>
            </label>
        </div>
    );
}
