"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { MainChart } from "@/components/dashboard/main-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { motion } from "framer-motion";
import { Download, Filter, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard Geral</h1>
                    <p className="text-muted-foreground">Bem-vindo de volta, Carlos. Aqui está o resumo das suas lojas.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/40 text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/40 text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm font-bold">
                        <RefreshCcw className="w-4 h-4" />
                        Sincronizar
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Visitas Totais"
                    value={124500}
                    delta={12.5}
                    type="number"
                />
                <KPICard
                    title="Vendas"
                    value={3420}
                    delta={8.2}
                    type="number"
                />
                <KPICard
                    title="Receita Total"
                    value={158400}
                    delta={-2.4}
                    type="currency"
                />
                <KPICard
                    title="Taxa de Conversão"
                    value={2.75}
                    delta={0.8}
                    type="percentage"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <MainChart />
                    <TopProducts />
                </div>

                {/* Sidebar info / Insights */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-6 rounded-2xl border border-border/40 shadow-sm"
                    >
                        <h3 className="font-heading font-bold text-lg mb-4">Alertas Recentes</h3>
                        <div className="space-y-4">
                            {[
                                { type: "danger", title: "Queda brusca em conversão", time: "Há 2 horas", product: "Smartphone S23" },
                                { type: "warning", title: "Estoque crítico (menos de 5 em estoque)", time: "Há 5 horas", product: "Sony WH-1000XM5" },
                                { type: "info", title: "Nova sugestão de IA disponível", time: "Há 1 dia", product: "Apple Watch" },
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/20">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.type === 'danger' ? 'bg-danger' : alert.type === 'warning' ? 'bg-accent' : 'bg-primary'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{alert.product} • {alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm font-semibold text-primary hover:underline">
                            Ver todos os alertas
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-6 rounded-2xl border border-border/40 shadow-sm bg-gradient-to-br from-primary/5 to-transparent"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <RefreshCcw className="w-5 h-5" />
                            </div>
                            <h3 className="font-heading font-bold text-lg">Sugestão da IA</h3>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/40 pl-4">
                            "Identificamos que anúncios com títulos que incluem o termo **'Frete Grátis'** no início apresentaram uma conversão **15% superior** na categoria de eletrônicos."
                        </p>
                        <button className="w-full mt-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Aplicar Otimizações
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
