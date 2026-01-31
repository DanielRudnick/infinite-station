"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Cpu,
    Database,
    Globe,
    Server,
    ShieldCheck,
    Zap,
    Clock,
    AlertCircle,
    BarChart3,
    HardDrive
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

const performanceData = [
    { time: "00:00", latency: 45, cpu: 12, memory: 40 },
    { time: "04:00", latency: 42, cpu: 10, memory: 38 },
    { time: "08:00", latency: 85, cpu: 25, memory: 55 },
    { time: "12:00", latency: 120, cpu: 45, memory: 70 },
    { time: "16:00", latency: 95, cpu: 30, memory: 60 },
    { time: "20:00", latency: 60, cpu: 18, memory: 45 },
    { time: "23:59", latency: 48, cpu: 14, memory: 42 },
];

export default function AdminHealthPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">System Health & Performance</h1>
                    <p className="text-muted-foreground">Monitoramento em tempo real da infraestrutura e latência de APIs.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Normal Operation</span>
                    </div>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "API Latency", value: "84ms", icon: Zap, status: "good", sub: "Avg per request" },
                    { label: "CPU Usage", value: "24%", icon: Cpu, status: "good", sub: "Core Cluster" },
                    { label: "Memory", value: "4.2GB", icon: HardDrive, status: "warning", sub: "Of 8GB total" },
                    { label: "DB Connections", value: "142", icon: Database, status: "good", sub: "Active pool" },
                ].map((m, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-border/40 hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <m.icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase",
                                m.status === 'good' ? "text-secondary" : "text-danger"
                            )}>{m.status}</span>
                        </div>
                        <p className="text-2xl font-heading font-bold">{m.value}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{m.label}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border/40">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            API Response Latency (24h)
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Latency (ms)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="latency" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border/40">
                        <h4 className="font-bold text-sm mb-6 flex items-center gap-2">
                            <Server className="w-4 h-4 text-primary" /> Active Nodes
                        </h4>
                        <div className="space-y-4">
                            {[
                                { name: "us-east-1 (Main)", load: "42%", uptime: "14d 2h" },
                                { name: "sa-east-1 (Edge)", load: "18%", uptime: "2d 14h" },
                                { name: "eu-central-1 (Backup)", load: "0%", uptime: "34d 8h" },
                            ].map((n, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold">{n.name}</p>
                                        <span className="text-[8px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded uppercase font-bold">Online</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                                        <span>Load: {n.load}</span>
                                        <span>Uptime: {n.uptime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-primary/20 bg-primary/[0.02]">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-primary">
                            <ShieldCheck className="w-4 h-4" /> Security Audit
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">OAuth Encryption</span>
                                <span className="text-secondary uppercase">AES-256 Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">TLS Version</span>
                                <span>1.3 (Strict)</span>
                            </div>
                            <button className="w-full py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase mt-2">
                                Review Firewall Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Incident Log Preview */}
            <div className="glass p-8 rounded-3xl border border-border/40">
                <h3 className="font-heading font-bold text-xl mb-6">Recent Status Changes</h3>
                <div className="space-y-3">
                    {[
                        { time: "Há 4h", msg: "Automatic failover test completed successfully.", type: "success" },
                        { time: "Ontem", msg: "Scheduled maintenance: Database schema migration applied.", type: "info" },
                        { time: "Dia 28/01", msg: "High latency detected in Shopee API bridge. System throttled requests.", type: "warning" },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/10 border border-border/20">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                log.type === 'success' ? "bg-secondary" :
                                    log.type === 'warning' ? "bg-danger" : "bg-primary"
                            )} />
                            <span className="text-[10px] font-bold text-muted-foreground min-w-[60px]">{log.time}</span>
                            <p className="text-sm font-medium text-foreground/80">{log.msg}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
