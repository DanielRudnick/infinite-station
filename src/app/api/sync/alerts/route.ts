import { NextRequest, NextResponse } from "next/server";
import { getCurrentTenantId } from "@/lib/data-access";
import { evaluateAlertRules } from "@/lib/alert-engine";

export async function POST(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();

        const results = await evaluateAlertRules(tenantId);

        return NextResponse.json({
            success: true,
            evaluated: results.length,
            results
        });
    } catch (e: any) {
        console.error("Alert evaluation error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
