import { NextRequest, NextResponse } from "next/server";
import { getCurrentTenantId } from "@/lib/data-access";
import { syncMercadoLivreMetrics } from "@/lib/sync-engine";

export async function POST(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();

        const result = await syncMercadoLivreMetrics(tenantId);

        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Metrics sync error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
