"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight, Store } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [step, setStep] = useState<"login" | "tenant">("login");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep("tenant");
        }, 1500);
    };

    const handleSelectTenant = (tenant: string) => {
        setLoading(true);
        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-[440px] p-8 rounded-3xl z-10 border border-white/10 shadow-2xl"
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-3xl font-heading">I</span>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Infinite Station</h1>
                    <p className="text-slate-400 text-sm">Gestão inteligente de e-commerce e analytics</p>
                </div>

                {step === "login" ? (
                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="seu@email.com"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <button className="text-xs text-slate-400 hover:text-primary transition-colors font-medium">Esqueceu sua senha?</button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Entrar na conta <ChevronRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-slate-400 text-sm mb-6 text-center">Selecione o ambiente que deseja acessar:</p>

                        {[
                            { id: "1", name: "Mega Store", items: "12 anúncios ativos" },
                            { id: "2", name: "Tech Solutions", items: "8 anúncios ativos" },
                            { id: "3", name: "Fashion Hub", items: "24 anúncios ativos" },
                        ].map((tenant) => (
                            <button
                                key={tenant.id}
                                onClick={() => handleSelectTenant(tenant.name)}
                                className="w-full group glass p-5 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Store className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{tenant.name}</p>
                                    <p className="text-xs text-slate-500">{tenant.items}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                            </button>
                        ))}

                        <button
                            onClick={() => setStep("login")}
                            className="w-full py-4 text-slate-500 hover:text-white text-sm font-medium transition-colors"
                        >
                            Voltar ao login
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
