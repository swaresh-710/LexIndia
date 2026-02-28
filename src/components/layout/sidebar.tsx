import Link from "next/link";
import { Folder, Users, LayoutDashboard, Settings, FileText } from "lucide-react";

export function Sidebar() {
    return (
        <div className="flex w-64 flex-col border-r bg-card h-screen fixed left-0 top-0">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <FileText className="h-6 w-6 text-primary" />
                    <span>LexIndia</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium gap-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all hover:text-accent-foreground"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/clients"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                        <Users className="h-4 w-4" />
                        Clients
                    </Link>
                    <Link
                        href="/cases"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                        <Folder className="h-4 w-4" />
                        Cases
                    </Link>
                </nav>
            </div>

            <div className="mt-auto border-t p-4">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </div>
    );
}
