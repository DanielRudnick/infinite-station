"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    DollarSign,
    Percent,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Filter,
    Download,
    Search,
    PieChart as PieChartIcon,
    Tag,
    Wallet
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";
import { useState } from "react";

const profitabilityData = [
    { sku: "MLB-S23-ULTRA", name: "Galaxy S23 Ultra", revenue: 589000, netProfit: 124000, margin: 21, ads_cost: 45000, fee: 94240, taxes: 58900 },
    { sku: "SONY-XM5-BLK", name: "Sony WH-1000XM5", revenue: 245000, netProfit: 68000, margin: 27.7, ads_cost: 12000, fee: 39200, taxes: 24500 },
    { sku: "APPLE-W9-45", name: "Apple Watch S9", revenue: 312000, netProfit: 42000, margin: 13.4, ads_cost: 28000, fee: 49920, taxes: 31200 },
    { sku: "LG-MON-27G", name: "Monitor LG 27'", revenue: 185000, netProfit: -12000, margin: -6.4, ads_cost: 32000, fee: 29600, taxes: 18500 },
];

const breakageData = [
    { name: 'Custo Produto', value: 45, color: '#6366f1' },
    { name: 'Taxas ML', value: 16, color: '#10b981' },
    { name: 'Impostos', value: 10, color: '#f59e0b' },
    { name: 'Marketing/Ads', value: 8, color: '#ec4899' },
    { name: 'Margem Líquida', value: 21, color: '#0ea5e9' },
];

export default function ProfitabilityPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const totalNet = profitabilityData.reduce((acc, curr) => acc + curr.netProfit, 0);
    const totalRev = profitabilityData.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgMargin = (totalNet / totalRev) * 100;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Unit Economics</h1>
                    <p className="text-muted-foreground">Visão real de lucro líquido por SKU, descontando todas as variáveis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 border border-border/40 text-sm font-bold">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                        <Wallet className="w-4 h-4" /> Configurar Custos Fixos
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl border border-border/40 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-secondary flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                        </span>
                    </div>
                    <p className="text-3xl font-heading font-bold mb-1">{formatCurrency(totalNet / 100)}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Lucro Líquido Acumulado</p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-secondary/10 transition-colors" />
                </div>

                <div className="glass p-6 rounded-3xl border border-border/40 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Percent className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-heading font-bold mb-1">{avgMargin.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Margem Líquida Média</p>
                </div>

                <div className="glass p-6 rounded-3xl border border-border/40 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-heading font-bold mb-1">{formatCurrency((totalRev * 0.08) / 100)}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Investimento em Ads (Total)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart - Breakdown */}
                <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border/40">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-primary" />
                            Composição da Receita BRUTA (Média)
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Proporção Estimada</span>
                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={breakageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {breakageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3 min-w-[200px] ml-8">
                            {breakageData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-xs font-medium text-muted-foreground">{d.name}</span>
                                    </div>
                                    <span className="text-xs font-bold">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actionable Insights */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-danger/20 bg-danger/[0.02]">
                        <h4 className="text-danger font-bold text-sm mb-4 flex items-center gap-2">
                            <ArrowDownRight className="w-4 h-4" /> Alerta de Prejuízo
                        </h4>
                        <p className="text-xs text-muted-foreground mb-4">
                            O produto <strong>Monitor LG 27'</strong> está operando com margem negativa de <strong>-6.4%</strong>.
                        </p>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-border/40 text-[10px] space-y-2">
                            <p className="text-muted-foreground">CAUSA ESTIMADA:</p>
                            <p className="font-bold">Investimento em Ads (R$ 32,00/venda) superando o lucro bruto.</p>
                            <button className="w-full py-2 bg-danger text-white rounded-lg font-bold mt-2 hover:bg-danger/90 transition-all">Pausar Ads Recomendado</button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-secondary/20 bg-secondary/[0.02]">
                        <h4 className="text-secondary font-bold text-sm mb-4 flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4" /> Oportunidade ROI
                        </h4>
                        <p className="text-xs text-muted-foreground mb-4">
                            O <strong>Sony WH-1000XM5</strong> tem a maior margem líquida (27.7%).
                        </p>
                        <button className="w-full py-2 bg-secondary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/90 transition-all">Escalar Investimento</button>
                    </div>
                </div>
            </div>

            {/* SKU Table */}
            <div className="glass rounded-3xl border border-border/40 overflow-hidden">
                <div className="p-6 border-b border-border/40 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg">Lucratividade Detalhada por SKU</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filtrar SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-muted/40 border border-border/40 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-[250px]"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">SKU / Produto</th>
                                <th className="px-6 py-4 text-right">Preço Médio</th>
                                <th className="px-6 py-4 text-right">Taxas & Impostos</th>
                                <th className="px-6 py-4 text-right">Ads (Unit.)</th>
                                <th className="px-6 py-4 text-right">Lucro Líquido</th>
                                <th className="px-6 py-4 text-right">Margem %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {profitabilityData.map((p, i) => (
                                <tr key={i} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-border/40 p-1">
                                                <Tag className="w-full h-full text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs">{p.sku}</p>
                                                <p className="text-[10px] text-muted-foreground">{p.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {formatCurrency(p.revenue / 100 / 100)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-danger font-medium text-xs">
                                        -{formatCurrency((p.fee + p.taxes) / 100 / 100)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-danger font-medium text-xs">
                                        -{formatCurrency(p.ads_cost / 100 / 100)}
                                    </td>
                                    <td className={cn(
                                        "px-6 py-4 text-right font-bold transition-all",
                                        p.netProfit > 0 ? "text-secondary" : "text-danger"
                                    )}>
                                        {formatCurrency(p.netProfit / 100 / 100)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-bold text-[10px]",
                                            p.margin > 20 ? "bg-secondary/10 text-secondary" :
                                                p.margin > 0 ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"
                                        )}>
                                            {p.margin > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {p.margin}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
