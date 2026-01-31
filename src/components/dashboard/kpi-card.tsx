"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";
import CountUp from "react-countup";

interface KPICardProps {
    title: string;
    value: number;
    delta: number;
    type?: "currency" | "number" | "percentage";
    trend?: "up" | "down" | "neutral";
}

export function KPICard({ title, value, delta, type = "number", trend }: KPICardProps) {
    const isPositive = delta > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="glass p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden group"
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-heading font-bold">
                    {type === "currency" && "R$ "}
                    <CountUp
                        end={value}
                        separator="."
                        decimals={type === "percentage" ? 2 : 0}
                        duration={2.5}
                        easingFn={(t, b, c, d) => c * (-Math.pow(2, -10 * t / d) + 1) + b}
                    />
                    {type === "percentage" && "%"}
                </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                    "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold",
                    isPositive ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
                )}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(delta)}%
                </div>
                <span className="text-xs text-muted-foreground italic">vs. período anterior</span>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </motion.div>
    );
}
