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
                            tenantId: tenantId,
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
                            tenantId: tenantId,
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
