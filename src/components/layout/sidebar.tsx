"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    AlertTriangle,
    BarChart3,
    Settings,
    Bot,
    Plug,
    ChevronRight,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Package, label: "Produtos", href: "/products" },
    { icon: AlertTriangle, label: "Alertas", href: "/alerts" },
    { icon: Plug, label: "Integrações", href: "/integrations" },
    { icon: BarChart3, label: "Relatórios", href: "/reports" },
    { icon: Bot, label: "Assistente IA", href: "/ai-assistant" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 glass border-r border-border/40 fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-xl font-heading">I</span>
                </div>
                <div>
                    <h1 className="font-heading font-bold text-lg leading-none">Infinite</h1>
                    <p className="text-xs text-muted-foreground">Station</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                                <span className="font-medium flex-1">{item.label}</span>
                                {isActive && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-border/40">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                        <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">Mega Store</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Tenant Admin</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger hover:bg-danger/10 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </div>
    );
}
