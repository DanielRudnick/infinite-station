import { prisma } from "./prisma";
import { decrypt, encrypt } from "./crypto";
import { exchangeMeliCodeForToken, MELI_API_URL } from "./meli";

/**
 * Retrieves a decrypted access token for a specific integration.
 * Handles token refreshing if expired.
 */
export async function getDecryptedAccessToken(tenantId: string, integrationId: string): Promise<string> {
    const integration = await prisma.integration.findFirst({
        where: {
            id: integrationId,
            tenantId: tenantId
        },
    });

    if (!integration) {
        throw new Error("Integration not found");
    }

    // Check if token is expired (giving a 5-minute buffer)
    const isExpired = integration.expiresAt && new Date() > new Date(integration.expiresAt.getTime() - 5 * 60 * 1000);

    if (isExpired && integration.refreshToken) {
        console.log(`Token for integration ${integrationId} expired. Refreshing...`);
        try {
            const refreshToken = decrypt(integration.refreshToken);
            const newData = await refreshMeliToken(refreshToken);

            // Update DB with new tokens
            await prisma.integration.update({
                where: { id: integrationId },
                data: {
                    accessToken: encrypt(newData.access_token),
                    refreshToken: encrypt(newData.refresh_token),
                    expiresAt: new Date(Date.now() + newData.expires_in * 1000),
                    updatedAt: new Date(),
                },
            });

            return newData.access_token;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            // If refresh fails, we might want to mark status as disconnected or specific error
            await prisma.integration.update({
                where: { id: integrationId },
                data: { status: "ERROR_REFRESH" }
            });
            throw new Error("Failed to refresh expired token");
        }
    }

    return decrypt(integration.accessToken);
}

async function refreshMeliToken(refreshToken: string) {
    const clientId = process.env.ML_CLIENT_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;

    const response = await fetch(`${MELI_API_URL}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: clientId || "",
            client_secret: clientSecret || "",
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Meli refresh failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}
