"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight, Store } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
    const [step, setStep] = useState<"login" | "tenant">("login");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Ensure we are targeting the form inputs
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };

        const email = target.email.value;
        const password = target.password.value;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Credenciais inválidas");
                setLoading(false);
            } else {
                toast.success("Login realizado com sucesso!");
                // Transition to tenant selection wizard step
                setStep("tenant");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Erro ao realizar login");
            setLoading(false);
        }
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
                                    name="email"
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
                                    name="password"
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
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-white mb-2">Bem-vindo de volta!</h2>
                            <p className="text-slate-400 text-sm">Selecione o ambiente que deseja gerenciar agora:</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: "1", name: "Mega Store", items: "12 anúncios ativos", trend: "+12%" },
                                { id: "2", name: "Tech Solutions", items: "8 anúncios ativos", trend: "+5%" },
                                { id: "3", name: "Fashion Hub", items: "24 anúncios ativos", trend: "+18%" },
                            ].map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => handleSelectTenant(tenant.name)}
                                    className="w-full group glass p-5 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 text-left relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Store className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white group-hover:text-primary transition-colors">{tenant.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{tenant.items}</p>
                                            <span className="text-[10px] text-secondary font-bold">{tenant.trend}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-all group-hover:translate-x-1" />

                                    {/* Aesthetic gradient line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep("login")}
                            className="w-full py-4 text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
                        >
                            Voltar ao login
                        </button>

                        <div className="pt-4 border-t border-white/5 text-center">
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Acesso seguro via Infinite-Auth</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
            <Toaster position="top-right" richColors />
        </div>
    );
}
