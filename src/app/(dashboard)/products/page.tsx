"use client";

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    RefreshCcw,
    MoreVertical,
    TrendingUp,
    TrendingDown,
    PackageSearch,
    ExternalLink
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // For now fetching all, pagination can be added later
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to load products", error);
            toast.error("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        toast.info("Iniciando sincronização...");

        try {
            const res = await fetch("/api/sync/products", { method: "POST" });
            const data = await res.json();

            if (data.success) {
                toast.success(`Sincronização concluída! ${data.count} produtos atualizados.`);
                fetchProducts();
            } else {
                toast.error("Erro na sincronização: " + data.error);
            }
        } catch (error) {
            toast.error("Falha ao comunicar com o servidor");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Meus Produtos</h1>
                    <p className="text-muted-foreground">Gerencie seu catálogo, preços e estoque.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Sincronizando..." : "Sincronizar"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors text-sm font-bold">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl glass border border-border/40">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, SKU ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground/70"
                    />
                </div>
                <div className="w-px h-8 bg-border/40 hidden md:block" />
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros Avançados
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <PackageSearch className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-bold text-lg text-foreground">Nenhum produto encontrado</p>
                    <p className="text-sm">Tente ajustar seus filtros ou sincronize seu catálogo.</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl border border-border/40 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Produto</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Preço</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-border/20 shrink-0">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                            <PackageSearch className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link href={`/products/${product.id}`} className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 hover:underline">
                                                        {product.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{product.id}</span>
                                                        {product.sku && <span className="text-[10px] text-muted-foreground font-mono">SKU: {product.sku}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-sm">{formatCurrency(product.price)}</div>
                                            {/* Placeholder for future trend */}
                                            <div className="text-[10px] text-muted-foreground">via Mercado Livre</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/products/${product.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
