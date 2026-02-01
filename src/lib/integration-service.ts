import { prisma } from "./prisma";
import { encrypt } from "./crypto";

/**
 * Ensures a default tenant exists and returns its ID.
 */
/**
 * Helper to ensure tenant exists -> Moved to relying on Auth Session
 */
// export async function getOrCreateDefaultTenant() { ... }

/**
 * Saves or updates a marketplace/ERP integration in the database.
 */
export async function saveIntegration(params: {
    tenantId: string;
    type: "MERCADO_LIVRE" | "TINY" | "BLING" | "OLIST";
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}) {
    const { tenantId } = params;
    const encryptedAccessToken = encrypt(params.accessToken);
    const encryptedRefreshToken = params.refreshToken ? encrypt(params.refreshToken) : null;

    const expiresAt = params.expiresIn
        ? new Date(Date.now() + params.expiresIn * 1000)
        : null;

    return await prisma.integration.upsert({
        where: {
            tenantId_type: {
                tenantId: tenantId,
                type: params.type,
            },
        },
        create: {
            tenantId: tenantId,
            type: params.type,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            expiresAt: expiresAt,
            status: "CONNECTED",
            lastSync: new Date(),
        },
        update: {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            expiresAt: expiresAt,
            status: "CONNECTED",
            lastSync: new Date(),
        }
    });
}

