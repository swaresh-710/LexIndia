"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Users, LayoutDashboard, Settings, FileText, CalendarCheck, X } from "lucide-react";
import { useEffect } from "react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/cases", label: "Cases", icon: Folder },
    { href: "/tasks", label: "Tasks", icon: CalendarCheck },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [pathname, isOpen, onClose]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-14 items-center justify-between border-b px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <FileText className="h-6 w-6 text-primary" />
                        <span>LexIndia</span>
                    </Link>
                    {onClose && (
                        <button onClick={onClose} className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-muted">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium gap-1">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto border-t p-4">
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${pathname === "/settings"
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </div>
        </>
    );
}
