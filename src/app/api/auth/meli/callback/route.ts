import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { exchangeMeliCodeForToken } from "@/lib/meli";
import { saveIntegration } from "@/lib/integration-service";
import { getCurrentTenantId } from "@/lib/data-access";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        console.error("Meli OAuth error:", error);
        return NextResponse.redirect(new URL("/integrations?status=error&message=" + error, req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/integrations?status=error&message=missing_code", req.url));
    }

    try {
        const tokenData = await exchangeMeliCodeForToken(code);

        const tenantId = await getCurrentTenantId();

        // Save integration to database
        await saveIntegration({
            tenantId,
            type: "MERCADO_LIVRE",
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
        });

        console.log("Meli Token Saved Successfully");

        // Redirect back to integrations page with success
        return NextResponse.redirect(new URL("/integrations?status=success&channel=meli", req.url));
    } catch (e) {
        console.error("Meli Token Exchange Error:", e);
        return NextResponse.redirect(new URL("/integrations?status=error&message=exchange_failed", req.url));
    }
}
