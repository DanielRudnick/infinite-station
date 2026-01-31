import { NextRequest, NextResponse } from "next/server";
import { exchangeMeliCodeForToken } from "@/lib/meli";

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

        // In a real application, you would save tokenData to your database here.
        // tokenData contains: access_token, refresh_token, expires_in, etc.
        console.log("Meli Token Data:", tokenData);

        // Redirect back to integrations page with success
        return NextResponse.redirect(new URL("/integrations?status=success&channel=meli", req.url));
    } catch (e) {
        console.error("Meli Token Exchange Error:", e);
        return NextResponse.redirect(new URL("/integrations?status=error&message=exchange_failed", req.url));
    }
}
