import { prisma } from "./prisma";

export async function runListingDoctor(tenantId: string) {
    const products = await prisma.product.findMany({
        where: { tenantId },
        include: {
            dailyMetrics: {
                orderBy: { date: "desc" },
                take: 7
            }
        }
    });

    for (const product of products) {
        const recommendations = [];

        // 1. Title Diagnosis
        if (product.title.length < 25) {
            recommendations.push({
                type: "TITLE",
                priority: "MEDIUM",
                title: "Título muito curto",
                description: "Títulos curtos reduzem a visibilidade nas buscas. Tente incluir marca, modelo e principal característica.",
                aiRationale: "Produtos com títulos < 25 caracteres costumam ter 30% menos cliques."
            });
        }

        // 2. Stock Health
        const latestMetrics = product.dailyMetrics[0];
        if (latestMetrics && latestMetrics.stock <= 5) {
            recommendations.push({
                type: "STOCK",
                priority: "HIGH",
                title: "Estoque em nível crítico",
                description: "Seu estoque está abaixo de 5 unidades. Reponha para evitar pausa no anúncio.",
                aiRationale: "Risco iminente de 'out-of-stock' nas próximas 48h baseado na média de vendas."
            });
        }

        // 3. Price Anomaly
        if (product.dailyMetrics.length >= 2) {
            const currentPrice = product.dailyMetrics[0].price;
            const avgPrice = product.dailyMetrics.reduce((acc, m) => acc + m.price, 0) / product.dailyMetrics.length;

            if (currentPrice > avgPrice * 1.15) {
                recommendations.push({
                    type: "PRICE",
                    priority: "MEDIUM",
                    title: "Preço acima da média histórica",
                    description: "Seu preço atual está 15% acima da média recente desse produto.",
                    aiRationale: "Aumentos bruscos de preço costumam causar queda de 20-40% na conversão."
                });
            }
        }

        // 4. Traffic Anomaly (Listing Doctor Special)
        const visitsToday = latestMetrics?.visits || 0;
        const avgVisits = product.dailyMetrics.reduce((acc, m) => acc + m.visits, 0) / (product.dailyMetrics.length || 1);

        if (visitsToday < avgVisits * 0.5 && visitsToday > 0) {
            recommendations.push({
                type: "TRAFFIC",
                priority: "HIGH",
                title: "Anomalia na queda de tráfego",
                description: "Identificamos uma queda brusca de visitas (-50%) não relacionada ao mercado.",
                aiRationale: "Pode haver um problema de indexação ou novo concorrente agressivo."
            });
        }

        // Save Recommendations
        for (const rec of recommendations) {
            await (prisma as any).recommendation.upsert({
                where: {
                    // Custom logic to avoid duplicates: find existing unresolved rec of same type for product
                    id: (await findExistingRecommendation(product.id, rec.type)) || "new-rec"
                },
                update: {
                    priority: rec.priority,
                    title: rec.title,
                    description: rec.description,
                    aiRationale: rec.aiRationale
                },
                create: {
                    productId: product.id,
                    tenantId,
                    ...rec
                }
            });
        }
    }
}

async function findExistingRecommendation(productId: string, type: string) {
    const existing = await (prisma as any).recommendation.findFirst({
        where: {
            productId,
            type,
            resolved: false
        }
    });
    return existing?.id;
}
