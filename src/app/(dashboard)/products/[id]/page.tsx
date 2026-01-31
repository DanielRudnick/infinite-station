"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Eye,
    ShoppingBag,
    MessageCircle,
    MousePointer2,
    Calendar,
    Sparkles,
    Zap,
    Package,
    History,
    CheckCircle2,
    AlertTriangle,
    BarChart3,
    Info,
    ArrowUpRight,
    Timer
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    ReferenceLine
} from "recharts";
import { useRouter } from "next/navigation";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { useState } from "react";

const data: any[] = [];

export default function ProductDrilldownPage() {
    const router = useRouter();
    const [showMLInsights, setShowMLInsights] = useState(true);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-tight">Eletrônicos</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">SKU: MLB123-GA-S23</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold tracking-tight">Smartphone Galaxy S23 Ultra 5G 256GB</h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors font-bold text-sm">
                        <History className="w-4 h-4" />
                        Histórico
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
                        <ExternalLink className="w-4 h-4" />
                        Ver no Marketplace
                    </button>
                </div>
            </div>

            {/* ML Alert Banner */}
            <AnimatePresence>
                {showMLInsights && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center text-danger">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-danger">Anomalia Detectada pela IA</p>
                                    <p className="text-xs text-danger/80">Queda de 40% na conversão em comparação com o histórico de domingos.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMLInsights(false)}
                                className="text-xs font-bold text-danger hover:underline"
                            >
                                Ignorar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border/40 flex flex-col items-center">
                        <div className="w-full aspect-square rounded-2xl bg-white overflow-hidden mb-6 border border-border/40 p-2">
                            <img
                                src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop"
                                alt="Product"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Status</span>
                                <span className="font-bold text-secondary flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> Ativo
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Estoque</span>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold">24 unidades</span>
                                    <span className="text-[10px] text-danger font-bold flex items-center gap-1">
                                        <Timer className="w-3 h-3" /> Esgota em ~3 dias
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Preço</span>
                                <span className="font-bold">{formatCurrency(5890)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-primary/20 bg-primary/[0.02]">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-sm">Predictive Health</h4>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 font-bold">
                                    <span>Chance de Venda (Hoje)</span>
                                    <span className="text-secondary">82%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "82%" }}
                                        className="h-full bg-secondary"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 font-bold">
                                    <span>Qualidade SEO</span>
                                    <span className="text-primary">94/100</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "94%" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Visitas", value: "4.2k", delta: "+12%", icon: Eye, color: "primary" },
                            { label: "Conversão", value: "8.4%", delta: "-2.1%", icon: MousePointer2, color: "danger" },
                            { label: "Vendas", value: "349", delta: "+5%", icon: ShoppingBag, color: "secondary" },
                            { label: "Buy Box", value: "98%", delta: "Máximo", icon: Zap, color: "accent" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-5 rounded-3xl border border-border/40 relative overflow-hidden group hover:border-primary/20 transition-all"
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl mb-4 flex items-center justify-center",
                                    stat.color === 'primary' && "bg-primary/10 text-primary",
                                    stat.color === 'secondary' && "bg-secondary/10 text-secondary",
                                    stat.color === 'danger' && "bg-danger/10 text-danger",
                                    stat.color === 'accent' && "bg-accent/10 text-accent",
                                )}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-2xl font-heading font-bold mb-1">{stat.value}</p>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                <div className={cn(
                                    "absolute top-6 right-6 text-xs font-bold px-2 py-0.5 rounded-lg",
                                    stat.color === 'secondary' || stat.delta.startsWith('+') ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
                                )}>
                                    {stat.delta}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass p-6 rounded-3xl border border-border/40 h-[350px] relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-heading font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Performance Temporal
                            </h3>
                            <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-muted-foreground">
                                <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary" /> Visitas</div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-b border-dashed border-primary" /> Projeção ML</div>
                            </div>
                        </div>

                        <div className="h-[230px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                    />
                                    <ReferenceLine x="Sex" stroke="var(--color-danger)" strokeDasharray="3 3" label={{ position: 'top', value: 'Anomalia', fill: 'var(--color-danger)', fontSize: 10, fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="visitas" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* IA Suggestions */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-heading font-bold">Smart Insights & AI</h2>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/[0.02] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-primary" /> Recomendação Crítica
                            </div>
                        </div>
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            Sugestão de Preço Dinâmico
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border/40">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">Preço Atual</p>
                                <p className="text-xl font-bold">{formatCurrency(5890)}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 relative">
                                <p className="text-[10px] text-secondary mb-1 uppercase tracking-widest font-bold">Sugerido IA</p>
                                <p className="text-xl font-bold text-secondary">{formatCurrency(5749)}</p>
                                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-secondary">
                                    <ArrowUpRight className="w-3 h-3" /> ROI +12%
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                            Baseado na análise da concorrência e elasticidade de preço, uma redução de <span className="text-secondary font-bold">2.4%</span> pode elevar o volume de vendas em <span className="font-bold text-foreground">18%</span> nos próximos 48h.
                        </p>

                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform text-sm">
                                Aplicar Novo Preço
                            </button>
                            <button className="px-6 py-4 border border-border/40 rounded-2xl font-bold text-sm hover:bg-muted/50 transition-colors">
                                Analisar Dados
                            </button>
                        </div>
                    </div>
                </div>

                {/* Predictive Metrics */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-muted-foreground" />
                        <h2 className="text-2xl font-heading font-bold">Simulação de Cenários</h2>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-border/40 relative h-full">
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 relative">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm mb-1">Impacto de Frete Grátis</h5>
                                    <p className="text-xs text-muted-foreground mb-3">Simulamos o impacto de oferecer frete grátis neste anúncio.</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Visitas</span>
                                            <span className="text-sm font-bold text-secondary">+25%</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Lucro Líquido</span>
                                            <span className="text-sm font-bold text-danger">-4%</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 relative">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm mb-1">Previsão de Fullfillment</h5>
                                    <p className="text-xs text-muted-foreground mb-3">Vantagem competitiva ao enviar para o centro de distribuição.</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Exposure</span>
                                            <span className="text-sm font-bold text-secondary">Top 3</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Confiança ML</span>
                                            <span className="text-sm font-bold">98.2%</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-2">
                            <Info className="w-4 h-4 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground font-medium">As simulações utilizam o motor Prophet v2 para projeções lineares.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
