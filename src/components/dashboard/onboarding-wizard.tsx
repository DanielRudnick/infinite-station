"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    ShoppingBag,
    RefreshCcw,
    Bell,
    ChevronRight,
    Sparkles,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Conecte sua Loja",
            description: "Integre com Mercado Livre ou seu ERP para começar a importar dados.",
            icon: ShoppingBag,
            action: { label: "Conectar Agora", href: "/integrations" },
            detail: "Suporte nativo para Meli, Tiny e Bling."
        },
        {
            title: "Sincronize Produtos",
            description: "Nossa IA irá mapear seus anúncios e sugerir otimizações de título e preço.",
            icon: RefreshCcw,
            action: { label: "Ir para Produtos", href: "/products" },
            detail: "Sincronização em tempo real via Webhook."
        },
        {
            title: "Configure Alertas",
            description: "Defina regras de preço e estoque para ser notificado antes de problemas ocorrerem.",
            icon: Bell,
            action: { label: "Configurar Alertas", href: "/alerts" },
            detail: "Alertas preditivos baseados em sazonalidade."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden shadow-2xl relative"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24 text-primary" />
            </div>

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3" /> Guia de Configuração
                            </div>
                            <h2 className="text-4xl font-heading font-bold text-white leading-tight">
                                Vamos turbinar seu <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">E-commerce agora?</span>
                            </h2>
                            <p className="text-slate-400 mt-4 max-w-md">
                                Siga os passos abaixo para configurar sua conta e habilitar as previsões de IA da Infinite Station.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    onClick={() => setCurrentStep(i)}
                                    className={cn(
                                        "group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                                        currentStep === i
                                            ? "bg-white/5 border-primary/30 shadow-lg shadow-primary/5"
                                            : "border-transparent hover:bg-white/5 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        currentStep === i ? "bg-primary text-white" : "bg-slate-800 text-slate-500"
                                    )}>
                                        {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-bold", currentStep === i ? "text-white" : "text-slate-400")}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {currentStep === i && <ArrowRight className="w-4 h-4 text-primary" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-solid p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                                    {(() => {
                                        const StepIcon = steps[currentStep].icon;
                                        return <StepIcon className="w-10 h-10" />;
                                    })()}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{steps[currentStep].title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {steps[currentStep].description}
                                    </p>
                                </div>

                                <div className="p-3 bg-secondary/5 border border-secondary/10 rounded-xl text-[10px] text-secondary font-bold uppercase tracking-widest">
                                    {steps[currentStep].detail}
                                </div>

                                <Link
                                    href={steps[currentStep].action.href}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {steps[currentStep].action.label}
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {currentStep < steps.length - 1 && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); setCurrentStep(prev => prev + 1); }}
                                        className="text-xs text-slate-500 hover:text-white font-bold uppercase tracking-widest transition-colors"
                                    >
                                        Pular este passo
                                    </button>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                />
            </div>
        </motion.div>
    );
}
