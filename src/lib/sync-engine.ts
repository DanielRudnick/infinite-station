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

    const accessToken = await getDecryptedAccessToken(tenantId, integration.id);

    // 2. Fetch User ID
    const userMe = await fetch(`${MELI_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json());

    if (!userMe.id) {
        throw new Error("Failed to fetch user profile from Mercado Livre");
    }

    // 3. Fetch ALL items using scroll pagination
    let allItemIds: string[] = [];
    let scrollId: string | null = null;
    let hasMore = true;

    while (hasMore) {
        const searchUrl = scrollId
            ? `${MELI_API_URL}/users/${userMe.id}/items/search?scroll_id=${scrollId}`
            : `${MELI_API_URL}/users/${userMe.id}/items/search?status=active&limit=100`;

        const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => res.json());

        const itemIds: string[] = searchRes.results || [];
        allItemIds = allItemIds.concat(itemIds);

        scrollId = searchRes.scroll_id || null;
        hasMore = !!scrollId && itemIds.length > 0;

        // Safety limit to prevent infinite loops
        if (allItemIds.length > 10000) break;
    }

    if (allItemIds.length === 0) {
        return { count: 0, message: "No active items found." };
    }

    // 4. Fetch Item Details in batches (API limit is ~20 items per request)
    const batchSize = 20;
    let syncedCount = 0;

    for (let i = 0; i < allItemIds.length; i += batchSize) {
        const batch = allItemIds.slice(i, i + batchSize);
        const itemsUrl = `${MELI_API_URL}/items?ids=${batch.join(",")}`;

        const itemsRes = await fetch(itemsUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => res.json());

        // 5. Upsert Products in Database
        for (const itemWrapper of itemsRes) {
            const item = itemWrapper.body;
            if (!item || !item.id) continue;

            try {
                await prisma.product.upsert({
                    where: {
                        tenantId_externalId: {
                            tenantId,
                            externalId: item.id,
                        },
                    },
                    update: {
                        title: item.title,
                        sku: item.seller_custom_field || getAttribute(item.attributes, "SELLER_SKU") || null,
                        status: item.status,
                        category: item.category_id,
                        categoryId: item.category_id,
                        imageUrl: item.thumbnail,
                        permalink: item.permalink,
                        price: item.price,
                        availableQuantity: item.available_quantity,
                        lastSyncedAt: new Date(),
                    },
                    create: {
                        tenantId,
                        externalId: item.id,
                        title: item.title,
                        sku: item.seller_custom_field || getAttribute(item.attributes, "SELLER_SKU") || null,
                        status: item.status,
                        category: item.category_id,
                        categoryId: item.category_id,
                        imageUrl: item.thumbnail,
                        permalink: item.permalink,
                        price: item.price,
                        availableQuantity: item.available_quantity,
                        lastSyncedAt: new Date(),
                    },
                });
                syncedCount++;
            } catch (e) {
                console.error(`Error syncing product ${item.id}:`, e);
            }
        }
    }

    return { count: syncedCount, message: `Synced ${syncedCount} products successfully.` };
}

export async function syncMercadoLivreMetrics(tenantId: string) {
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

    const accessToken = await getDecryptedAccessToken(tenantId, integration.id);

    // 2. Fetch all products for this tenant
    const products = await prisma.product.findMany({
        where: { tenantId },
        select: { id: true, externalId: true }
    });

    if (products.length === 0) {
        return { message: "No products found to sync metrics." };
    }

    let visitsSynced = 0;

    // 3. For each product, fetch visits (last 30 days)
    // MELI API: /items/{item_id}/visits/time_window?last=30&unit=day
    for (const product of products) {
        try {
            const visitsData = await fetch(`${MELI_API_URL}/items/${product.externalId}/visits/time_window?last=30&unit=day`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.json());

            if (visitsData.results) {
                // Save visits as ItemDailyMetrics
                for (const point of visitsData.results) {
                    const date = new Date(point.date);
                    // Set to start of day to ensure consistency
                    date.setUTCHours(0, 0, 0, 0);

                    await (prisma as any).itemDailyMetrics.upsert({
                        where: {
                            productId_date: {
                                productId: product.id,
                                date: date,
                            }
                        },
                        create: {
                            tenantId,
                            productId: product.id,
                            date: date,
                            visits: parseInt(point.total),
                        },
                        update: {
                            visits: parseInt(point.total),
                        }
                    });
                }
                visitsSynced++;
            }
        } catch (e) {
            console.error(`Failed to sync visits for ${product.externalId}:`, e);
        }
    }

    // 4. Fetch orders (last 30 days) to calculate SALES and REVENUE
    try {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 30);

        const ordersData = await fetch(`${MELI_API_URL}/orders/search?seller=${integration.tenantId}&order.date_created.from=${dateLimit.toISOString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => res.json());

        if (ordersData.results) {
            // Group orders by product and date
            for (const order of ordersData.results) {
                const orderDate = new Date(order.date_created);
                orderDate.setUTCHours(0, 0, 0, 0);

                for (const item of order.order_items) {
                    const product = products.find(p => p.externalId === item.item.id);
                    if (product) {
                        const quantity = item.quantity;
                        const revenue = item.unit_price * quantity;

                        await (prisma as any).itemDailyMetrics.upsert({
                            where: {
                                productId_date: {
                                    productId: product.id,
                                    date: orderDate,
                                }
                            },
                            create: {
                                tenantId,
                                productId: product.id,
                                date: orderDate,
                                orders: quantity,
                                revenue: revenue,
                            },
                            update: {
                                orders: { increment: quantity },
                                revenue: { increment: revenue },
                            }
                        });
                    }
                }
            }
        }
    } catch (e) {
        console.error("Failed to sync orders:", e);
    }

    return {
        message: "Metrics sync completed",
        visitsSynced
    };
}


function getAttribute(attributes: any[], id: string) {
    return attributes?.find((a: any) => a.id === id)?.value_name;
}
