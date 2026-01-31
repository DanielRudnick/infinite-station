import { NextRequest, NextResponse } from "next/server";
import { syncMercadoLivreProducts } from "@/lib/sync-engine";
import { getOrCreateDefaultTenant } from "@/lib/integration-service";

export async function POST(req: NextRequest) {
    try {
        // In a real app, we would get tenantId from the user session
        const tenantId = await getOrCreateDefaultTenant();

        const result = await syncMercadoLivreProducts(tenantId);

        return NextResponse.json({ success: true, ...result });

    } catch (e: any) {
        console.error("Sync Error:", e);
        return NextResponse.json({
            success: false,
            error: e.message || "Failed to sync products"
        }, { status: 500 });
    }
}
