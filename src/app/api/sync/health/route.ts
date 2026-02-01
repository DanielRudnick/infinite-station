import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { calculateDailyHealthScores } from "@/lib/health-engine";
import { getCurrentTenantId } from "@/lib/data-access";

export async function POST(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();
        await calculateDailyHealthScores(tenantId);

        return NextResponse.json({
            success: true,
            message: "Health scores calculated successfully"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
