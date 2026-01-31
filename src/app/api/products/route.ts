import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultTenant } from "@/lib/integration-service";

export async function GET(req: NextRequest) {
    try {
        const tenantId = await getOrCreateDefaultTenant();

        // Check if there are any products
        const productsCount = await prisma.product.count({
            where: { tenantId }
        });

        if (productsCount === 0) {
            return NextResponse.json([]);
        }

        // Fetch top products by default (logic can be improved)
        const products = await prisma.product.findMany({
            where: { tenantId },
            take: 10,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                metrics: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        });

        // Map to UI format
        const formatted = products.map((p: any) => ({
            id: p.externalId,
            name: p.title,
            sales: 0, // We need to sync sales metric later
            revenue: 0,
            conversion: 0,
            stock: 0, // Need to parse attribute or separate sync
            trend: "flat",
            image: p.imageUrl || "",
            price: p.metrics?.[0]?.value || 0
        }));

        return NextResponse.json(formatted);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
