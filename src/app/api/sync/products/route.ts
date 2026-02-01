import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { syncMercadoLivreProducts } from "@/lib/sync-engine";
import { getCurrentTenantId } from "@/lib/data-access";

export async function POST(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();

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
