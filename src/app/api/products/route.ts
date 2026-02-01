import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getCurrentTenantId } from "@/lib/data-access";

export async function GET(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();

        // Check if there are any products
        const productsCount = await (prisma.product as any).count({
            where: { tenantId }
        });

        if (productsCount === 0) {
            return NextResponse.json([]);
        }

        // Fetch top products with real metrics
        const products = await (prisma.product as any).findMany({
            where: { tenantId },
            take: 10,
            orderBy: {
                lastSyncedAt: 'desc'
            },
            include: {
                dailyMetrics: {
                    orderBy: { date: 'desc' },
                    take: 30
                }
            }
        });

        // Map to UI format with REAL calculated metrics
        const formatted = products.map((p: any) => {
            const last30Days = p.dailyMetrics || [];

            // Calculate real metrics from dailyMetrics
            const totalSales = last30Days.reduce((acc: number, m: any) => acc + m.orders, 0);
            const totalRevenue = last30Days.reduce((acc: number, m: any) => acc + m.revenue, 0);
            const totalVisits = last30Days.reduce((acc: number, m: any) => acc + m.visits, 0);

            // Use latest metrics or fallback to Product fields
            const latestMetrics = last30Days[0];
            const currentPrice = p.price || latestMetrics?.price || 0;
            const currentStock = p.availableQuantity ?? latestMetrics?.stock ?? 0;

            // Calculate conversion rate
            const conversionRate = totalVisits > 0 ? (totalSales / totalVisits) * 100 : 0;

            // Calculate trend (compare first 15 days vs last 15 days)
            const firstHalf = last30Days.slice(0, 15);
            const secondHalf = last30Days.slice(15, 30);
            const firstHalfSales = firstHalf.reduce((acc: number, m: any) => acc + m.orders, 0);
            const secondHalfSales = secondHalf.reduce((acc: number, m: any) => acc + m.orders, 0);

            let trend: "up" | "down" | "flat" = "flat";
            if (secondHalfSales > 0) {
                const change = ((firstHalfSales - secondHalfSales) / secondHalfSales) * 100;
                if (change > 10) trend = "up";
                else if (change < -10) trend = "down";
            }

            return {
                id: p.externalId,
                name: p.title,
                sales: totalSales,
                revenue: totalRevenue,
                conversion: Math.round(conversionRate * 100) / 100,
                stock: currentStock,
                trend,
                image: p.imageUrl || "",
                price: currentPrice,
                permalink: p.permalink || "",
                lastSynced: p.lastSyncedAt
            };
        });

        return NextResponse.json(formatted);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
