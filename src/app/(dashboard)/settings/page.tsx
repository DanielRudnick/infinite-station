"use client";

import { motion } from "framer-motion";
import {
    Users,
    Shield,
    Lock,
    Settings2,
    UserPlus,
    MoreVertical,
    ChevronRight,
    Database,
    Bell,
    Fingerprint,
    Globe,
    Coins,
    Languages
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const users = [
    { id: 1, name: "Admin User", email: "admin@infinitestation.com", role: "Admin", status: "Active" },
    { id: 2, name: "Analyst One", email: "analyst@infinitestation.com", role: "Analyst", status: "Active" },
    { id: 3, name: "Viewer User", email: "viewer@infinitestation.com", role: "Viewer", status: "Inactive" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("team");

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">Gerencie sua conta, equipe e níveis de acesso.</p>
                </div>
            </div>

            <div className="flex gap-8 border-b border-border/40 px-2">
                {[
                    { id: "team", label: "Equipe & RBAC", icon: Users },
                    { id: "general", label: "Geral", icon: Settings2 },
                    { id: "security", label: "Segurança", icon: Lock },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative flex items-center gap-2",
                            activeTab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                        {activeTab === t.id && (
                            <motion.div layoutId="setting-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === "team" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-heading font-bold">Gerenciar Equipe</h3>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                                    <UserPlus className="w-4 h-4" />
                                    Convidar Membro
                                </button>
                            </div>

                            <div className="glass rounded-2xl border border-border/40 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/30 border-b border-border/40">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Usuário</th>
                                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Permissão (RBAC)</th>
                                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{u.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
                                                        u.role === 'Admin' ? "bg-primary/10 text-primary" :
                                                            u.role === 'Analyst' ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                                                    )}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", u.status === 'Active' ? "bg-secondary" : "bg-danger")} />
                                                        <span className="text-xs font-medium">{u.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="glass p-8 rounded-3xl border border-border/40 space-y-8">
                                <div>
                                    <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-primary" />
                                        Idioma e Região
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                <Languages className="w-3.5 h-3.5" /> Idioma da Interface
                                            </label>
                                            <select className="w-full bg-muted/40 border border-border/40 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40">
                                                <option>Português (Brasil)</option>
                                                <option>English (US)</option>
                                                <option>Español (Latam)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                <Coins className="w-3.5 h-3.5" /> Moeda Padrão
                                            </label>
                                            <select className="w-full bg-muted/40 border border-border/40 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40">
                                                <option>BRL (R$)</option>
                                                <option>USD ($)</option>
                                                <option>ARS ($)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border/40">
                                    <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                                        <Database className="w-5 h-5 text-primary" />
                                        Data & Sync Global
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
                                            <div>
                                                <p className="text-sm font-bold">Timezone Operacional</p>
                                                <p className="text-[10px] text-muted-foreground">Sincronizar relatórios com o horário de Brasília (UTC-3)</p>
                                            </div>
                                            <span className="text-xs font-medium">America/Sao_Paulo</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
                                    Salvar Alterações Globais
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border/40">
                        <h4 className="font-heading font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Links Rápidos
                        </h4>
                        <div className="space-y-2">
                            <Link
                                href="/settings/audit"
                                className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted transition-all border border-border/40 group"
                            >
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                    <span className="text-sm font-bold">Audit Trail (Logs)</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Link>
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted transition-all border border-border/40 group">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                    <span className="text-sm font-bold">Uso da API</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted transition-all border border-border/40 group">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                    <span className="text-sm font-bold">Preferências</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
