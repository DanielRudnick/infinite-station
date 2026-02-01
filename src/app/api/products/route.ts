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

        // Fetch top products by default (logic can be improved)
        const products = await (prisma.product as any).findMany({
            where: { tenantId },
            take: 10,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                dailyMetrics: {
                    orderBy: { date: 'desc' },
                    take: 30
                }
            }
        });

        // Map to UI format
        const formatted = products.map((p: any) => {
            const last30Days = p.dailyMetrics || [];
            const sales = last30Days.reduce((acc: number, m: any) => acc + m.orders, 0);
            const revenue = last30Days.reduce((acc: number, m: any) => acc + m.revenue, 0);
            const latestPrice = last30Days[0]?.price || 0;
            const stock = last30Days[0]?.stock || 0;

            return {
                id: p.externalId,
                name: p.title,
                sales: sales,
                revenue: revenue,
                conversion: sales > 0 ? (sales / last30Days.reduce((acc: number, m: any) => acc + m.visits, 1)) * 100 : 0,
                stock: stock,
                trend: "flat", // Could calculate from previous period
                image: p.imageUrl || "",
                price: latestPrice
            };
        });

        return NextResponse.json(formatted);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
