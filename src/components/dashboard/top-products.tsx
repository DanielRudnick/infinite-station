"use client";

import { motion } from "framer-motion";
import { MoreVertical, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const products = [
    {
        id: "MLB123",
        name: "Smartphone Galaxy S23 Ultra 5G 256GB",
        sales: 145,
        revenue: 854000,
        conversion: 5.2,
        stock: 24,
        trend: "up",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop"
    },
    {
        id: "MLB456",
        name: "Fone de Ouvido Sony WH-1000XM5",
        sales: 89,
        revenue: 213000,
        conversion: 4.8,
        stock: 12,
        trend: "up",
        image: "https://images.unsplash.com/photo-1546435770-a3e42650d9b?w=100&h=100&fit=crop"
    },
    {
        id: "MLB789",
        name: "Câmera Mirrorless Canon EOS R6",
        sales: 34,
        revenue: 450000,
        conversion: 2.1,
        stock: 5,
        trend: "down",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop"
    },
    {
        id: "MLB012",
        name: "Apple Watch Series 9 GPS + Cellular",
        sales: 67,
        revenue: 167000,
        conversion: 3.5,
        stock: 18,
        trend: "up",
        image: "https://images.unsplash.com/photo-1434493907317-a46b53b81846?w=100&h=100&fit=crop"
    }
];

export function TopProducts() {
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
                                    <span className="text-sm font-medium">{formatCurrency(product.revenue)}</span>
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
