"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Bot,
    User,
    Sparkles,
    TrendingUp,
    MessageSquare,
    Zap,
    Info,
    ChevronRight,
    RefreshCw,
    LayoutDashboard,
    CheckCircle2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
    type?: "text" | "recommendation" | "comparison" | "qa";
    meta?: any;
}

const initialMessages: Message[] = [
    {
        role: "assistant",
        content: "Olá! Sou o assistente de IA da Infinite Station. Como posso ajudar com a sua operação hoje? Posso analisar anúncios, sugerir títulos, comparar períodos ou gerar previsões de estoque.",
        type: "text"
    }
];

const suggestions = [
    "Analise meu anúncio do S23 Ultra",
    "Como melhorar meu ticket médio?",
    "Previsão de estoque para o fone Sony",
    "Otimize títulos da categoria Eletrônicos"
];

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = { role: "user", content };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking and streaming
        setTimeout(() => {
            let aiResponse: Message;

            if (content.toLowerCase().includes("s23") || content.toLowerCase().includes("smartphone")) {
                aiResponse = {
                    role: "assistant",
                    content: "Analisei seu anúncio do **Smartphone Galaxy S23 Ultra**. Notei que a taxa de cliques (CTR) está acima da média (4.2%), mas a taxa de conversão caiu recentemente. Aqui estão minhas recomendações:",
                    type: "recommendation",
                    meta: {
                        title: "Otimização de Anúncio",
                        items: [
                            "Atualize o título para incluir 'Frete Grátis em 24h'",
                            "Adicione fotos reais do unboxing para aumentar confiança",
                            "Reduza o preço em 3% por 48h para recuperar o 'Best Seller'"
                        ]
                    }
                };
            } else if (content.toLowerCase().includes("título") || content.toLowerCase().includes("ab test")) {
                aiResponse = {
                    role: "assistant",
                    content: "Aqui está a comparação de performance para as variações de título do anúncio **Câmera Sony Alpha a7 IV**:",
                    type: "comparison",
                    meta: {
                        variations: [
                            { title: "Câmera Sony Alpha a7 IV Body - Mirrorless", ctr: "2.4%", sales: 12, status: "current" },
                            { title: "Sony Alpha a7 IV Câmera Profissional + Lente FE 28-70mm", ctr: "3.8%", sales: 25, status: "winner" },
                            { title: "Sony a7 IV Mirrorless full-frame Camera - Mirrorless 33MP", ctr: "1.9%", sales: 8, status: "loser" }
                        ]
                    }
                };
            } else if (content.toLowerCase().includes("pergunta") || content.toLowerCase().includes("responder")) {
                aiResponse = {
                    role: "assistant",
                    content: "Identifiquei **3 perguntas pendentes** no Mercado Livre que podem virar vendas imediatas. Deseja que eu gere as respostas?",
                    type: "qa",
                    meta: {
                        questions: [
                            { id: "q1", user: "Carlos_88", text: "Vem com nota fiscal e garantia de 1 ano?", product: "iPhone 15 Pro", suggested: "Olá Carlos! Sim, todos os nossos produtos são originais, com Nota Fiscal e garantia oficial de 1 ano pela Apple Brasil." },
                            { id: "q2", user: "Maria_Store", text: "Tem pronta entrega para o CEP 01310-000?", product: "Monitor Gamer LG 27'", suggested: "Olá! Sim, temos em estoque para pronta entrega. Para seu CEP, o prazo estimado é de 1 dia útil via Full." }
                        ]
                    }
                };
            } else {
                aiResponse = {
                    role: "assistant",
                    content: "Com base no histórico dos últimos 30 dias, observei uma tendência de crescimento na sua conta Mega Store. Recomendo focar na reposição dos produtos de curva A para evitar rupturas no próximo final de semana.",
                    type: "text"
                };
            }

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex h-[calc(100vh-160px)] gap-6">
            {/* Sidebar Suggestions */}
            <div className="w-80 hidden lg:flex flex-col gap-6">
                <div className="glass p-6 rounded-2xl border border-border/40">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-heading font-bold">Sugestões Rápidas</h3>
                    </div>
                    <div className="space-y-3">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(s)}
                                className="w-full text-left p-3 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-border/40 bg-primary/5">
                    <h4 className="font-bold text-sm mb-2">Insight do Dia</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        "Anuncios com vídeos curtos (Reels style) no Mercado Livre estão convertendo **22% mais** nesta semana."
                    </p>
                    <button className="flex items-center gap-2 mt-4 text-xs font-bold text-primary hover:underline">
                        Ler mais no blog <ChevronRight className="w-3" />
                    </button>
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col glass rounded-3xl border border-border/40 overflow-hidden shadow-sm relative">
                {/* Chat Header */}
                <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold">Assistente Proativo</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online & Contextualizado</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Messages Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-[85%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                m.role === "assistant" ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border/40"
                            )}>
                                {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            <div className="space-y-4">
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    m.role === "assistant" ? "bg-muted/40 border border-border/40" : "bg-primary text-white shadow-lg shadow-primary/20"
                                )}>
                                    {m.content}
                                </div>

                                {/* AI-Specific UI Components */}
                                {m.type === "recommendation" && m.meta && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-4"
                                    >
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Zap className="w-4 h-4 fill-secondary" />
                                            <span className="text-xs font-bold uppercase tracking-widest">{m.meta.title}</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {m.meta.items.map((item: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* ERP Context Data */}
                                        <div className="pt-4 mt-4 border-t border-secondary/20 grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <LayoutDashboard className="w-3.5 h-3.5 text-secondary" />
                                                <div>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Margem (ERP)</p>
                                                    <p className="text-xs font-bold text-secondary">32.4%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="w-3.5 h-3.5 text-secondary" />
                                                <div>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Estoque Total</p>
                                                    <p className="text-xs font-bold text-secondary">142 un.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full py-2 bg-secondary text-white text-[10px] font-bold rounded-lg hover:bg-secondary/90 transition-all uppercase tracking-widest shadow-md shadow-secondary/10">
                                            Aplicar Automaticamente
                                        </button>
                                    </motion.div>
                                )}

                                {m.type === "comparison" && m.meta && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl bg-muted/40 border border-border/40 space-y-4 max-w-xl"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-primary">A/B Testing - Títulos</span>
                                        </div>
                                        <div className="space-y-3">
                                            {m.meta.variations.map((v: any, idx: number) => (
                                                <div key={idx} className={cn(
                                                    "p-3 rounded-xl border transition-all",
                                                    v.status === 'winner' ? "bg-secondary/10 border-secondary/40" :
                                                        v.status === 'current' ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border/40 opacity-60"
                                                )}>
                                                    <div className="flex justify-between items-start gap-4 mb-2">
                                                        <p className="text-xs font-medium leading-tight flex-1">{v.title}</p>
                                                        {v.status === 'winner' && <div className="text-[8px] font-bold bg-secondary text-white px-1.5 py-0.5 rounded">Vencedor</div>}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">CTR</p>
                                                            <p className="text-xs font-bold">{v.ctr}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">Vendas</p>
                                                            <p className="text-xs font-bold">{v.sales}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-2.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest">
                                            Atualizar Anúncio com Vencedor
                                        </button>
                                    </motion.div>
                                )}

                                {m.type === "qa" && m.meta && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        {m.meta.questions.map((q: any, idx: number) => (
                                            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border/40 shadow-sm space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-muted-foreground">DE: {q.user} • {q.product}</span>
                                                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium italic border-l-2 border-primary/40 pl-3 py-1">"{q.text}"</p>
                                                <div className="pt-2">
                                                    <p className="text-[10px] text-secondary font-bold uppercase mb-2">Sugestão de Resposta IA</p>
                                                    <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-dashed border-border/60">{q.suggested}</p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button className="flex-1 py-2 bg-secondary text-white text-[10px] font-bold rounded-lg hover:bg-secondary/90 transition-all">Enviar Resposta</button>
                                                    <button className="px-4 py-2 border border-border/40 text-[10px] font-bold rounded-lg hover:bg-muted transition-colors">Editar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 flex gap-1">
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/40 bg-muted/10">
                    <div className="max-w-4xl mx-auto flex gap-3">
                        <div className="relative flex-1">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                                type="text"
                                placeholder="Pergunte qualquer coisa sobre sua operação..."
                                className="w-full bg-background border border-border/60 rounded-2xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm shadow-sm"
                            />
                            <button
                                onClick={() => handleSend(input)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                                disabled={!input.trim() || isTyping}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-3">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Info className="w-3 h-3" /> A IA pode cometer erros. Verifique informações importantes.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
