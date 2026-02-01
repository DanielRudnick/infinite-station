"use client";

import { motion } from "framer-motion";
import { Search, Bell, Calendar, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function Topbar() {
    const { data: session } = useSession();
    const user = session?.user;

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <header className="h-20 glass border-b border-border/40 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between">
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar produtos, anúncios, alertas..."
                        className="w-full bg-muted/30 border border-border/40 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Global Timepicker */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/40">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Últimos 30 dias</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition-colors border border-border/40"
                >
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-background" />
                </motion.button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border/40">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{user?.name || "Usuário"}</p>
                        <p className="text-[10px] text-muted-foreground">{user?.email || "Convidado"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/60 border-2 border-background shadow-md overflow-hidden flex items-center justify-center text-white font-bold">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>{getInitials(user?.name)}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
