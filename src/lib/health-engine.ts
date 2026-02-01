import { prisma } from "./prisma";

export async function calculateDailyHealthScores(tenantId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // 1. Fetch all products for tenant
    const products = await prisma.product.findMany({
        where: { tenantId }
    });

    for (const product of products) {
        try {
            // Fetch 7-day average for baseline
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);

            const metrics = await (prisma as any).itemDailyMetrics.findMany({
                where: {
                    productId: product.id,
                    date: { gte: sevenDaysAgo, lt: today }
                },
                orderBy: { date: "desc" }
            });

            if (metrics.length === 0) continue;

            const latest = metrics[0];

            // --- TRAFFIC SCORE (30%) ---
            // Based on visits trend (latest vs 7-day avg)
            const avgVisits = metrics.reduce((acc: number, m: any) => acc + m.visits, 0) / metrics.length;
            const trafficScore = Math.min(100, (latest.visits / (avgVisits || 1)) * 100);

            // --- CONVERSION SCORE (40%) ---
            // Based on orders/visits ratio
            const conversionRate = latest.visits > 0 ? (latest.orders / latest.visits) : 0;
            const conversionScore = Math.min(100, (conversionRate / 0.02) * 100); // Baseline 2% CR = 100 points

            // --- STOCK SCORE (20%) ---
            // Based on stock levels (assuming 30 days cover is ideal)
            const dailySalesAvg = metrics.reduce((acc: number, m: any) => acc + m.orders, 0) / metrics.length;
            const daysCover = dailySalesAvg > 0 ? (latest.stock / dailySalesAvg) : 30;
            const stockScore = daysCover >= 15 ? 100 : (daysCover / 15) * 100;

            // --- VIBRANCY SCORE (10%) ---
            // Based on stability (price volatility)
            const priceChanges = metrics.filter((m: any, i: number) => i > 0 && m.price !== metrics[i - 1].price).length;
            const vibrancyScore = Math.max(0, 100 - (priceChanges * 20));

            // COMPOSITE SCORE
            const totalScore = (trafficScore * 0.3) + (conversionScore * 0.4) + (stockScore * 0.2) + (vibrancyScore * 0.1);

            // Save Snapshot
            await (prisma as any).productHealthSnapshot.upsert({
                where: {
                    productId_date: {
                        productId: product.id,
                        date: today
                    }
                },
                update: {
                    score: totalScore,
                    trafficScore,
                    conversionScore,
                    stockScore,
                    vibrancyScore
                },
                create: {
                    productId: product.id,
                    tenantId,
                    date: today,
                    score: totalScore,
                    trafficScore,
                    conversionScore,
                    stockScore,
                    vibrancyScore
                }
            });

        } catch (e) {
            console.error(`Error calculating health score for product ${product.id}:`, e);
        }
    }
}
