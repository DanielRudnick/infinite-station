import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { runListingDoctor } from "@/lib/diagnosis-engine";
import { getCurrentTenantId } from "@/lib/data-access";

export async function POST(req: NextRequest) {
    try {
        const tenantId = await getCurrentTenantId();
        await runListingDoctor(tenantId);

        return NextResponse.json({
            success: true,
            message: "Listing diagnostics completed successfully"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
