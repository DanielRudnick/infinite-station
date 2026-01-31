import { prisma } from "./prisma";
import { encrypt } from "./crypto";

/**
 * Ensures a default tenant exists and returns its ID.
 */
export async function getOrCreateDefaultTenant() {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: "Loja Padrão",
                slug: "loja-padrao",
            }
        });
    }
    return tenant.id;
}

/**
 * Saves or updates a marketplace/ERP integration in the database.
 */
export async function saveIntegration(params: {
    tenantId?: string;
    type: "MERCADO_LIVRE" | "TINY" | "BLING" | "OLIST";
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}) {
    const tenantId = params.tenantId || await getOrCreateDefaultTenant();
    const encryptedAccessToken = encrypt(params.accessToken);
    const encryptedRefreshToken = params.refreshToken ? encrypt(params.refreshToken) : null;

    const expiresAt = params.expiresIn
        ? new Date(Date.now() + params.expiresIn * 1000)
        : null;

    return await prisma.integration.upsert({
        where: {
            id: await findIdByType(tenantId, params.type) || "new-id",
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

async function findIdByType(tenantId: string, type: string) {
    const integration = await prisma.integration.findFirst({
        where: { tenantId, type }
    });
    return integration?.id;
}
