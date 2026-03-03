"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
            <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
            </button>

            <div className="w-full flex-1">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search clients or cases..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <button className="rounded-full bg-accent p-2 text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
                <span className="sr-only">Toggle user menu</span>
            </button>
        </header>
    );
}
