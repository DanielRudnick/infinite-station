import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { validateTinyToken } from "@/lib/tiny";
import { saveIntegration } from "@/lib/integration-service";
import { getCurrentTenantId } from "@/lib/data-access";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
        }

        const data = await validateTinyToken(token);

        const tenantId = await getCurrentTenantId();

        // Save integration to database
        await saveIntegration({
            tenantId,
            type: "TINY",
            accessToken: token, // Tiny V3 token doesn't usually expire like OAuth
        });

        console.log("Tiny Token Saved Successfully");

        return NextResponse.json({
            success: true,
            accountName: data.conta?.nome || "Conta Tiny ERP"
        });
    } catch (e: any) {
        console.error("Tiny Token Validation Error:", e);
        return NextResponse.json({ error: e.message || "Falha na validação do token" }, { status: 400 });
    }
}
