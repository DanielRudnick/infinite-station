"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    RefreshCcw,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Clock,
    ShieldCheck,
    ChevronRight,
    ShoppingBag,
    Settings2,
    Database,
    Search,
    Key,
    Globe,
    Truck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const connectors = [
    {
        id: "meli-1",
        name: "Mercado Livre",
        type: "Marketplace",
        status: "disconnected",
        lastSync: "Aguardando primeira conexão",
        account: "Não conectado",
        logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.3/mercadolibre/logo__large_plus.png",
    },
    {
        id: "tiny-1",
        name: "Tiny ERP",
        type: "ERP",
        status: "disconnected",
        lastSync: "Aguardando primeira conexão",
        account: "Não conectado",
        logo: "https://www.tiny.com.br/wp-content/themes/tiny/img/logo-tiny.svg",
    },
    {
        id: "bling-1",
        name: "Bling!",
        type: "ERP",
        status: "disconnected",
        lastSync: "N/A",
        account: "Aguardando Conexão",
        logo: "https://www.bling.com.br/wp-content/themes/bling/assets/images/logo-bling.svg"
    }
];

const availableConnectors = [
    { name: "Shopee", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" },
    { name: "Magalu", logo: "https://logodownload.org/wp-content/uploads/2014/04/magalu-logo-0.png" },
    { name: "Olist", logo: "https://olist.com/wp-content/uploads/2021/05/Logo-olist-azul.png" },
];

export default function IntegrationsPage() {
    const [connecting, setConnecting] = useState(false);
    const [configModal, setConfigModal] = useState<string | null>(null);
    const [syncingId, setSyncingId] = useState<string | null>(null);

    const handleConnect = () => {
        setConnecting(true);
        setTimeout(() => {
            setConnecting(false);
        }, 2000);
    };

    const handleSync = (id: string) => {
        setSyncingId(id);
        setTimeout(() => setSyncingId(null), 1500);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Canais e Integrações</h1>
                    <p className="text-muted-foreground">Gerencie as conexões com marketplaces e sistemas de ERP.</p>
                </div>

                <button
                    onClick={handleConnect}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Conectar Novo Canal
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-5 rounded-2xl border border-border/40 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">00</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Canais Ativos</p>
                    </div>
                </div>
                <div className="glass p-5 rounded-2xl border border-border/40 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">00</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Falha na Sincronia</p>
                    </div>
                </div>
                <div className="glass p-5 rounded-2xl border border-border/40 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Items Sincronizados/Hora</p>
                    </div>
                </div>
            </div>

            {/* Main List */}
            <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl px-2">Suas Conexões</h2>
                <div className="grid grid-cols-1 gap-4">
                    {connectors.map((connector, i) => (
                        <motion.div
                            key={connector.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 rounded-2xl border border-border/40 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-xl bg-muted/30 flex items-center justify-center p-3 relative bg-white dark:bg-slate-800">
                                <img src={connector.logo} alt={connector.name} className="max-w-full max-h-full object-contain" />
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                                    connector.status === 'connected' ? "bg-secondary" : "bg-danger"
                                )} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{connector.name}</h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted uppercase text-muted-foreground">
                                        {connector.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <ShoppingBag className="w-4 h-4" />
                                        {connector.account}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <RefreshCcw className={cn("w-4 h-4", syncingId === connector.id && "animate-spin")} />
                                        Sync: {connector.lastSync}
                                    </div>
                                    {connector.status === 'connected' && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-tight">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            CONECTADO
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {connector.status === 'connected' ? (
                                    <>
                                        <button
                                            onClick={() => setConfigModal(connector.id)}
                                            className="px-4 py-2 rounded-xl text-sm font-semibold border border-border/40 hover:bg-muted/50 transition-colors flex items-center gap-2"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                            Configurar
                                        </button>
                                        <button
                                            onClick={() => handleSync(connector.id)}
                                            disabled={syncingId === connector.id}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCcw className={cn("w-4 h-4", syncingId === connector.id && "animate-spin")} />
                                            Sync Agora
                                        </button>
                                    </>
                                ) : (
                                    <button className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        Reconectar
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Future Marketplaces */}
            <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl px-2">Em Breve</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availableConnectors.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            className="glass p-6 rounded-2xl border border-dashed border-border/60 flex items-center justify-between grayscale"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg p-2 flex items-center justify-center border border-border/40">
                                    <img src={c.logo} alt={c.name} className="max-w-full max-h-full" />
                                </div>
                                <span className="font-bold text-sm">{c.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Fase 3</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Config Modals */}
            <AnimatePresence>
                {configModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setConfigModal(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass w-full max-w-2xl p-8 rounded-3xl z-10 border border-white/10 shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-heading font-bold">Configuração ERP</h3>
                                        <p className="text-sm text-muted-foreground">Sincronização de regras e dados técnicos</p>
                                    </div>
                                </div>
                                <button onClick={() => setConfigModal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">Regra de Estoque</label>
                                        <div className="relative">
                                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <select className="w-full bg-muted/30 border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option>Estoque Real (Tiny → Meli)</option>
                                                <option>Buffer de Segurança (-2 un)</option>
                                                <option>Virtual (Multiplicador x1.5)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">Frequência de Sync</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <select className="w-full bg-muted/30 border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option>Tempo Real (Webhooks)</option>
                                                <option>A cada 15 minutos</option>
                                                <option>A cada 1 hora</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold border-b border-border/40 pb-2">Segurança e Credenciais</h4>
                                    <div className="p-4 rounded-xl bg-secondary/[0.03] border border-secondary/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Key className="w-5 h-5 text-secondary" />
                                            <div>
                                                <p className="text-xs font-bold">Chave de API</p>
                                                <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">************************48ef2</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-primary font-bold hover:underline">Alterar Key</button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider ml-1">URL de Callback (Webhook)</label>
                                    <div className="flex gap-2">
                                        <input readOnly value="https://api.infinitestation.com/v1/webhook/tiny/28f92j" className="flex-1 bg-muted/20 border border-border/40 rounded-xl py-2.5 px-4 text-[10px] font-mono text-muted-foreground" />
                                        <button className="px-4 py-2 bg-muted rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors">Copiar</button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-10">
                                <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                                    Salvar Alterações
                                </button>
                                <button
                                    onClick={() => setConfigModal(null)}
                                    className="px-6 py-3.5 border border-border/40 rounded-2xl font-bold text-sm hover:bg-muted/50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* OAuth Mock Modal */}
            {connecting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setConnecting(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass w-full max-w-md p-8 rounded-3xl z-10 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                <div className="relative z-10 w-full h-full bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl">
                                    <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.3/mercadolibre/logo__large_plus.png" alt="MELI" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-2">Conectar Mercado Livre</h3>
                            <p className="text-muted-foreground text-sm mb-8">
                                Você será redirecionado para o Mercado Livre para autorizar o acesso da Infinite Station à sua conta.
                            </p>

                            <div className="space-y-4 mb-8 text-left bg-muted/30 p-4 rounded-2xl border border-border/40">
                                <div className="flex items-center gap-3 text-xs font-medium text-foreground">
                                    <ShieldCheck className="w-4 h-4 text-secondary" />
                                    Privacidade Garantida
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 text-secondary" /> Leitura de anúncios e métricas
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 text-secondary" /> Sincronização de vendas e estoque
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <AlertCircle className="w-3 h-3 text-accent" /> Não temos acesso à sua senha
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                                    onClick={() => setConnecting(false)}
                                >
                                    Ir para Mercado Livre <ExternalLink className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setConnecting(false)}
                                    className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
