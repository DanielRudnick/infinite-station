"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Settings2,
    Bell,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Plus,
    Volume2,
    VolumeX,
    ArrowRight,
    ChevronDown,
    Trash2,
    Sparkles,
    ShieldCheck,
    Activity,
    Zap,
    Sliders
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const alertsData = [
    {
        id: "alt-1",
        severity: "danger",
        title: "Queda na Taxa de Conversão",
        description: "A taxa de conversão do produto 'Smartphone S23' caiu 45% nas últimas 24h.",
        product: "Smartphone S23 Ultra",
        time: "Há 12 minutos",
        status: "unack",
        type: "real-time"
    },
    {
        id: "alt-ml-1",
        severity: "warning",
        title: "Risco de Ruptura de Estoque",
        description: "IA detectou que o estoque atual esgotará em 72h conforme tendência de vendas.",
        product: "Sony WH-1000XM5",
        time: "Há 45 minutos",
        status: "unack",
        type: "predictive",
        confidence: 94
    },
    {
        id: "alt-2",
        severity: "warning",
        title: "Estoque em Nível Crítico",
        description: "Restam apenas 3 unidades no estoque do Mercado Livre.",
        product: "Sony WH-1000XM5",
        time: "Há 2 horas",
        status: "unack",
        type: "real-time"
    },
    {
        id: "alt-ml-2",
        severity: "info",
        title: "Oportunidade de Buy Box",
        description: "Ajuste de preço de R$ 399 para R$ 389 garante 100% de dominância amanhã.",
        product: "Apple Pencil 2nd Gen",
        time: "Há 3 horas",
        status: "unack",
        type: "predictive",
        confidence: 88
    }
];

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(alertsData);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [filter, setFilter] = useState("all");
    const [sensitivity, setSensitivity] = useState(75);

    const filteredAlerts = alerts.filter(a => {
        if (filter === "unack") return a.status === "unack";
        if (filter === "ack") return a.status === "ack";
        if (filter === "predictive") return a.type === "predictive";
        return true;
    });

    const handleAck = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "ack" } : a));
    };

    const handleDelete = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Centro de Alertas</h1>
                    <p className="text-muted-foreground">Monitore e gerencie anomalias reais e tendências preditivas.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={cn(
                            "p-2.5 rounded-xl border transition-all",
                            soundEnabled
                                ? "bg-secondary/10 border-secondary/30 text-secondary"
                                : "bg-muted/40 border-border/40 text-muted-foreground"
                        )}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setShowConfig(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/40 font-bold"
                    >
                        <Settings2 className="w-5 h-5" />
                        Configurar Regras
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold">
                        <Plus className="w-5 h-5" />
                        Nova Regra
                    </button>
                </div>
            </div>

            {/* Tabs / Filters */}
            <div className="flex items-center justify-between border-b border-border/40 px-2">
                <div className="flex gap-8">
                    {[
                        { id: "all", label: "Geral" },
                        { id: "unack", label: "Pendentes" },
                        { id: "predictive", label: "Projeções ML" }
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={cn(
                                "pb-4 text-sm font-bold transition-all relative",
                                filter === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t.label}
                            {filter === t.id && (
                                <motion.div layoutId="active-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground w-40"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                </div>
            </div>

            {/* Alerts Grid */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredAlerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="font-heading font-bold text-xl">Tudo limpo!</h3>
                            <p className="text-muted-foreground">Nenhum alerta pendente no momento.</p>
                        </motion.div>
                    ) : (
                        filteredAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "glass p-6 rounded-2xl border flex items-start gap-6 transition-all group",
                                    alert.status === 'unack' ? "border-primary/20 bg-primary/[0.02]" : "border-border/40 opacity-70",
                                    alert.type === 'predictive' && "border-secondary/20 shadow-sm"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                    alert.severity === 'danger' ? "bg-danger/10 text-danger" :
                                        alert.severity === 'warning' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary",
                                    alert.type === 'predictive' && "bg-secondary/10 text-secondary"
                                )}>
                                    {alert.type === 'predictive' ? <Sparkles className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-lg flex items-center gap-3">
                                            {alert.title}
                                            {alert.type === 'predictive' && (
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary uppercase tracking-tighter">Predictive</span>
                                            )}
                                            {alert.status === 'unack' && (
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                {alert.time}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{alert.description}</p>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground uppercase">SKU</div>
                                            {alert.product}
                                        </div>

                                        {alert.confidence && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Confiança IA</span>
                                                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-secondary" style={{ width: `${alert.confidence}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-secondary">{alert.confidence}%</span>
                                            </div>
                                        )}

                                        {alert.status === 'unack' && (
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button
                                                    onClick={() => handleAck(alert.id)}
                                                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                                                >
                                                    Resolver
                                                </button>
                                                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-border/40 text-xs font-bold hover:bg-muted transition-colors">
                                                    Ação Recomendada <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Rule Config Modal */}
            <AnimatePresence>
                {showConfig && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowConfig(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass w-full max-w-2xl p-8 rounded-3xl z-10 border border-white/10 shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                                <div className="flex items-center gap-3">
                                    <Settings2 className="w-6 h-6 text-primary" />
                                    <div>
                                        <h3 className="text-2xl font-heading font-bold">Regras Inteligentes</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Alertas & Automação ML</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowConfig(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/20">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Sensibilidade IA</p>
                                        </div>
                                        <span className="text-sm font-bold text-primary">{sensitivity}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sensitivity}
                                        onChange={(e) => setSensitivity(parseInt(e.target.value))}
                                        className="w-full accent-primary bg-muted h-1 rounded-full range-sm"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-bold uppercase">
                                        <span>Conservador</span>
                                        <span>Agressivo</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Automações Preditivas</p>
                                    {[
                                        { name: "Detector de Ruptura (IA)", description: "Alerta 72h antes do estoque esgotar", type: "pred", enabled: true },
                                        { name: "Anomalia de Conversão", description: "Notifica se conversão desviar do padrão sazonal", type: "pred", enabled: true },
                                        { name: "Pausa por Preço Errado", description: "Pausa anúncios se ERP e Meli divergirem", type: "real", enabled: false },
                                    ].map((rule, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", rule.type === 'pred' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary')}>
                                                    {rule.type === 'pred' ? <Sparkles className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{rule.name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{rule.description}</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => { }}
                                                className={cn(
                                                    "w-10 h-5 rounded-full relative transition-all cursor-pointer",
                                                    rule.enabled ? "bg-secondary" : "bg-slate-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                                    rule.enabled ? "left-5.5" : "left-0.5"
                                                )} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all text-sm"
                                    onClick={() => setShowConfig(false)}
                                >
                                    Salvar Mudanças
                                </button>
                                <button
                                    onClick={() => setShowConfig(false)}
                                    className="px-8 py-4 border border-border/40 rounded-2xl font-bold text-sm hover:bg-muted/50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
