import { prisma } from "./prisma";
import { getDecryptedAccessToken } from "./token-manager";
import { MELI_API_URL } from "./meli";

export async function syncMercadoLivreProducts(tenantId: string) {
    // 1. Find the connected Mercado Livre integration for this tenant
    const integration = await prisma.integration.findFirst({
        where: {
            tenantId,
            type: "MERCADO_LIVRE",
            status: "CONNECTED",
        },
    });

    if (!integration) {
        throw new Error("No connected Mercado Livre account found for this tenant.");
    }

    const accessToken = await getDecryptedAccessToken(integration.id);

    // 2. Fetch User ID
    const userMe = await fetch(`${MELI_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json());

    if (!userMe.id) {
        throw new Error("Failed to fetch user profile from Mercado Livre");
    }

    // 3. Search for active items (scroll logic simplified for demo)
    // For a full implementation we would loop through 'scroll_id'
    const searchUrl = `${MELI_API_URL}/users/${userMe.id}/items/search?status=active&limit=50`;
    const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json());

    const itemIds: string[] = searchRes.results || [];

    if (itemIds.length === 0) {
        return { count: 0, message: "No active items found." };
    }

    // 4. Fetch Item Details
    // GET /items?ids=MLB123,MLB456...
    const itemsUrl = `${MELI_API_URL}/items?ids=${itemIds.join(",")}`;
    const itemsRes = await fetch(itemsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json());

    // 5. Upsert Products in Database
    let syncedCount = 0;

    for (const itemWrapper of itemsRes) {
        if (itemWrapper.code === 200) {
            const item = itemWrapper.body;

            await prisma.product.upsert({
                where: {
                    tenantId_externalId: {
                        tenantId: tenantId,
                        externalId: item.id,
                    },
                },
                create: {
                    tenantId: tenantId,
                    externalId: item.id,
                    title: item.title,
                    sku: item.seller_custom_field || getAttribute(item.attributes, "SELLER_SKU") || null,
                    status: item.status,
                    category: item.category_id,
                    imageUrl: item.thumbnail,
                    metrics: {
                        create: {
                            type: "PRICE_SNAPSHOT",
                            value: item.price,
                            timestamp: new Date(),
                        }
                    }
                },
                update: {
                    title: item.title,
                    sku: item.seller_custom_field || getAttribute(item.attributes, "SELLER_SKU") || null,
                    status: item.status,
                    imageUrl: item.thumbnail,
                    updatedAt: new Date(),
                    // We also log a price snapshot metric on update
                    metrics: {
                        create: {
                            type: "PRICE_SNAPSHOT",
                            value: item.price,
                            timestamp: new Date(),
                        }
                    }
                },
            });
            syncedCount++;
        }
    }

    return { count: syncedCount, message: "Sync completed successfully" };
}

function getAttribute(attributes: any[], id: string) {
    return attributes?.find((a: any) => a.id === id)?.value_name;
}
