"use client";

import { motion } from "framer-motion";
import { MoreVertical, ExternalLink, TrendingUp, TrendingDown, PackageSearch } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export function TopProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // Listen for sync events
        window.addEventListener("product-sync-complete", fetchProducts);
        return () => window.removeEventListener("product-sync-complete", fetchProducts);
    }, []);

    if (loading) {
        return (
            <div className="glass rounded-2xl border border-border/40 p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border border-border/40 shadow-sm p-12 text-center"
            >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageSearch className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    Conecte suas contas do Mercado Livre ou ERP e clique em "Sincronizar" para importar seus anúncios.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-border/40 shadow-sm overflow-hidden"
        >
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div>
                    <h3 className="font-heading font-bold text-lg">Top Produtos</h3>
                    <p className="text-sm text-muted-foreground">Produtos com maior volume de vendas</p>
                </div>
                <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                    Ver todos <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted/30">
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Vendas</th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Receita</th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Conversão</th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Estoque</th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">{product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-sm font-bold">{product.sales}</span>
                                        {product.trend === "up" ? (
                                            <TrendingUp className="w-3 h-3 text-secondary" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-danger" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-medium">{product.price ? formatCurrency(product.price) : '-'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-medium">{product.conversion}%</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded-full",
                                        product.stock < 10 ? "bg-danger/10 text-danger" : "bg-secondary/10 text-secondary"
                                    )}>
                                        {product.stock} un
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
