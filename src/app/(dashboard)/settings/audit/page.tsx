"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    History,
    User,
    Settings2,
    Monitor,
    ShieldAlert,
    Search,
    Filter,
    Download,
    Terminal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const auditLogs = [
    { id: 1, action: "Update Price", user: "Admin User", product: "Smartphone S23", oldVal: "R$ 5.890", newVal: "R$ 5.749", time: "Há 12 min", system: "Web Dashboard" },
    { id: 2, action: "Sync Stock", user: "IA Engine", product: "Sony WH-1000XM5", oldVal: "14", newVal: "12", time: "Há 45 min", system: "ERP Sync" },
    { id: 3, action: "Pause Ad", user: "Analyst One", product: "Apple Watch S9", oldVal: "Active", newVal: "Paused", time: "Há 2 horas", system: "Web Dashboard" },
    { id: 4, action: "Manual Edit", user: "Admin User", product: "Geral", oldVal: "ML Rules", newVal: "Custom Rules", time: "Há 4 horas", system: "Settings" },
    { id: 5, action: "Login", user: "Analyst One", product: "-", oldVal: "-", newVal: "-", time: "Há 6 horas", system: "Auth Service" },
];

export default function AuditTrailPage() {
    const router = useRouter();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2.5 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Audit Trail</h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Registro histórico de todas as ações administrativas e automações.
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 border border-border/40 text-sm font-bold">
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por usuário, produto ou ação..."
                                className="w-full bg-muted/30 border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 text-sm font-bold text-muted-foreground hover:text-foreground">
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-secondary" /> 52 Ações hoje
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border/40 text-muted-foreground">
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">Data/Hora</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">Ação</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">Usuário</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">Objeto</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">De → Para</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-wider">Origem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {auditLogs.map((log) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-muted/10 transition-colors"
                                >
                                    <td className="py-4 text-muted-foreground whitespace-nowrap">{log.time}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                                            log.action.includes("Price") ? "bg-secondary/10 text-secondary" :
                                                log.action.includes("Sync") ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-4 font-bold flex items-center gap-2">
                                        {log.user === 'IA Engine' ? <Terminal className="w-3.5 h-3.5 text-secondary" /> : <User className="w-3.5 h-3.5 text-muted-foreground" />}
                                        {log.user}
                                    </td>
                                    <td className="py-4 font-mono text-xs">{log.product}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-[10px] font-medium">
                                            <span className="opacity-50">{log.oldVal}</span>
                                            <span className="text-secondary">→</span>
                                            <span>{log.newVal}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <Monitor className="w-3 h-3" />
                                            {log.system}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className="w-full mt-6 py-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors border-t border-border/40">
                    Carregar mais registros
                </button>
            </div>

            <div className="glass p-8 rounded-3xl border border-primary/10 bg-primary/[0.01]">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-heading font-bold mb-1">Integridade dos Logs</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Todos os logs são criptografados e imutáveis via <strong>Infinite Integrity Engine</strong>.
                            Nenhuma ação, incluindo exclusões de usuários, pode ser removida deste histórico por 5 anos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
