import { NextRequest, NextResponse } from "next/server";
import { validateTinyToken } from "@/lib/tiny";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
        }

        const data = await validateTinyToken(token);

        // In a real application, you would save this token securely here.
        console.log("Tiny Token Validated Successfully:", data);

        return NextResponse.json({
            success: true,
            accountName: data.conta?.nome || "Conta Tiny ERP"
        });
    } catch (e: any) {
        console.error("Tiny Token Validation Error:", e);
        return NextResponse.json({ error: e.message || "Falha na validação do token" }, { status: 400 });
    }
}
