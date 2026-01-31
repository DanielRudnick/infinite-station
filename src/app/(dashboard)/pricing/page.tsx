"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Settings2,
    Plus,
    ArrowRight,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Search,
    ChevronDown,
    Info,
    Maximize2,
    Minimize2,
    Lock,
    Power
} from "lucide-react";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";

const pricingRules = [
    { id: 1, name: "Ganhar Buy Box (Agressivo)", trigger: "Concorrente Altera Preço", action: "Preço - R$ 0,10", minMargin: "15%", status: "Active" },
    { id: 2, name: "Queima de Estoque (Auto)", trigger: "Estoque > 100 un. & 0 vendas/3d", action: "Preço - 5%", minMargin: "5%", status: "Active" },
    { id: 3, name: "Maximização de Lucro", trigger: "Estoque < 10 un. & Buy Box Dominada", action: "Preço + 2%", minMargin: "25%", status: "Inactive" },
];

export default function PricingEnginePage() {
    const [activeRule, setActiveRule] = useState<number | null>(null);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Reprecificador Dinâmico</h1>
                    <p className="text-muted-foreground">Automação de preços baseada em regras de margem, estoque e concorrência.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <Plus className="w-5 h-5" /> Nova Regra IA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rules List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-bold text-lg">Regras Ativas</h3>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                            <span className="w-2 h-2 rounded-full bg-secondary" /> 2 Online
                        </div>
                    </div>

                    <div className="space-y-4">
                        {pricingRules.map((rule) => (
                            <motion.div
                                key={rule.id}
                                layout
                                className={cn(
                                    "glass p-6 rounded-3xl border transition-all cursor-pointer group",
                                    rule.status === 'Active' ? "border-primary/20 bg-primary/[0.02]" : "border-border/40 opacity-70"
                                )}
                                onClick={() => setActiveRule(rule.id === activeRule ? null : rule.id)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                                            rule.status === 'Active' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{rule.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">{rule.trigger}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                            rule.status === 'Active' ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {rule.status}
                                        </div>
                                        <Power className={cn("w-5 h-5", rule.status === 'Active' ? "text-secondary" : "text-muted-foreground")} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/40">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Ação</p>
                                        <p className="text-sm font-bold text-primary">{rule.action}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Margem Mínima</p>
                                        <p className="text-sm font-bold">{rule.minMargin}</p>
                                    </div>
                                    <div className="text-right flex items-center justify-end gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                                        <span className="text-xs font-bold">Configurar</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Global Repricing Safeguards */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-secondary/20 bg-secondary/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-secondary" /> Trava de Segurança
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider">
                                    <span>ROI Mínimo (Global)</span>
                                    <span className="text-secondary">10%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary w-[10%]" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 italic">
                                    Nenhum preço será alterado se o lucro líquido cair abaixo deste limite.
                                </p>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-secondary/20">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Sincronização Ativa</span>
                                    <div className="w-8 h-4 bg-secondary rounded-full relative">
                                        <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Notificar via WhatsApp</span>
                                    <div className="w-8 h-4 bg-muted rounded-full relative">
                                        <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-border/40">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Como Funciona?
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            O motor de reprecificação monitora o Mercado Livre a cada <strong>5 minutos</strong>. Caso um concorrente mude o preço, ou seu estoque atinja um gatilho, a IA recalcula a oferta ideal respeitando suas margens do ERP Tiny/Bling.
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics Preview */}
            <div className="glass p-8 rounded-3xl border border-border/40">
                <h3 className="font-heading font-bold text-xl mb-8">Últimas Alterações Automáticas</h3>
                <div className="space-y-4">
                    {[
                        { sku: "MLB-S23-ULTRA", oldPrice: 5890, newPrice: 5749, reason: "Buy Box Perdia", time: "Há 12 min" },
                        { sku: "SONY-XM5-BLK", oldPrice: 2450, newPrice: 2499, reason: "Estoque Baixo", time: "Há 45 min" },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-border/40 flex items-center justify-center font-bold text-[10px]">SKU</div>
                                <div>
                                    <p className="font-bold text-sm">{log.sku}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold text-primary">{log.reason}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Variação</p>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <span className="opacity-40">{formatCurrency(log.oldPrice)}</span>
                                        <ArrowRight className="w-3 h-3 text-secondary" />
                                        <span className="text-secondary">{formatCurrency(log.newPrice)}</span>
                                    </div>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Hora</p>
                                    <p className="text-xs font-medium">{log.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
