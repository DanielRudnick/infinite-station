"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    ReferenceArea
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const historicalData = [
    { name: "01 Jan", visitas: 4000, vendas: 240, forecast: null },
    { name: "02 Jan", visitas: 3000, vendas: 198, forecast: null },
    { name: "03 Jan", visitas: 2000, vendas: 180, forecast: null },
    { name: "04 Jan", visitas: 2780, vendas: 220, forecast: null },
    { name: "05 Jan", visitas: 1890, vendas: 150, forecast: null },
    { name: "06 Jan", visitas: 2390, vendas: 210, forecast: null },
    { name: "07 Jan", visitas: 3490, vendas: 280, forecast: null },
];

const forecastData = [
    { name: "07 Jan", visitas: 3490, vendas: 280, forecast: 280 },
    { name: "08 Jan", visitas: null, vendas: null, forecast: 350 },
    { name: "09 Jan", visitas: null, vendas: null, forecast: 310 },
    { name: "10 Jan", visitas: null, vendas: null, forecast: 380 },
    { name: "11 Jan", visitas: null, vendas: null, forecast: 420 },
    { name: "12 Jan", visitas: null, vendas: null, forecast: 450 },
];

export function MainChart() {
    const [showForecast, setShowForecast] = useState(false);
    const chartData = showForecast ? [...historicalData, ...forecastData.slice(1)] : historicalData;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-2xl border border-border/40 shadow-sm h-[400px] relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold text-lg">Performance & Forecast</h3>
                        {showForecast && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3" /> IA Engine
                            </motion.span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">Métricas reais e projeções para os próximos 5 dias</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-medium text-primary uppercase">Visitas</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-xs font-medium text-secondary uppercase">Vendas</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForecast(!showForecast)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-xl border font-bold text-xs transition-all",
                            showForecast
                                ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20"
                                : "border-border/40 text-muted-foreground hover:border-primary/40"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Forecast Pro
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--color-foreground)", opacity: 0.5 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--color-foreground)", opacity: 0.5 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.9)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)"
                            }}
                            itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                        />

                        {showForecast && (
                            <ReferenceArea
                                x1="07 Jan"
                                fill="var(--color-secondary)"
                                fillOpacity={0.03}
                                strokeOpacity={0}
                            />
                        )}

                        <Area
                            type="monotone"
                            dataKey="visitas"
                            stroke="var(--color-primary)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisitas)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="vendas"
                            stroke="var(--color-secondary)"
                            strokeWidth={3}
                            fillOpacity={showForecast ? 0 : 1}
                            fill="url(#colorVendas)"
                            animationDuration={2000}
                        />

                        {showForecast && (
                            <Area
                                type="monotone"
                                dataKey="forecast"
                                stroke="var(--color-secondary)"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                fill="transparent"
                                animationDuration={1000}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <AnimatePresence>
                {showForecast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-6 flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-full"
                    >
                        <Info className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-tight">
                            Previsão de +15% em vendas para a próxima semana
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
