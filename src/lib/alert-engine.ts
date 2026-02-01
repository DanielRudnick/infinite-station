import { prisma } from "./prisma";

export async function evaluateAlertRules(tenantId: string) {
    const now = new Date();

    // 1. Fetch enabled rules for the tenant
    const rules = await (prisma as any).alertRule.findMany({
        where: {
            tenantId,
            enabled: true,
        },
    });

    const results = [];

    for (const rule of rules) {
        // Check cooldown
        if (rule.lastTriggered) {
            const cooldownMs = rule.cooldownMinutes * 60 * 1000;
            if (now.getTime() - rule.lastTriggered.getTime() < cooldownMs) {
                continue;
            }
        }

        try {
            const isTriggered = await checkRule(rule, tenantId);

            if (isTriggered) {
                // Create Alert
                await prisma.alert.create({
                    data: {
                        tenantId: rule.tenantId,
                        productId: rule.productId,
                        ruleId: rule.id,
                        title: `Alerta: ${rule.metric.toUpperCase()} ${rule.condition}`,
                        description: `A métrica ${rule.metric} apresentou um(a) ${rule.condition} superior a ${rule.threshold}% nos últimos ${rule.windowDays} dias.`,
                        severity: rule.condition === "drop" ? "DANGER" : "WARNING",
                        ruleType: "AUTOMATIC",
                    } as any
                });

                // Update lastTriggered
                await (prisma as any).alertRule.update({
                    where: { id: rule.id },
                    data: { lastTriggered: now }
                });

                results.push({ ruleId: rule.id, status: "triggered" });
            } else {
                results.push({ ruleId: rule.id, status: "ok" });
            }
        } catch (e) {
            console.error(`Error evaluating rule ${rule.id}:`, e);
            results.push({ ruleId: rule.id, status: "error", error: String(e) });
        }
    }

    return results;
}

async function checkRule(rule: any, tenantId: string): Promise<boolean> {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - rule.windowDays);

    // Fetch current window metrics
    const currentMetrics = await (prisma as any).itemDailyMetrics.aggregate({
        where: {
            tenantId,
            productId: rule.productId || undefined,
            date: {
                gte: currentStart,
                lt: now,
            }
        },
        _sum: {
            visits: true,
            orders: true,
            revenue: true,
        },
        _avg: {
            price: true,
            stock: true,
        }
    });

    const currentVal = getValueFromAggregate(currentMetrics, rule.metric);

    let compareVal = 0;

    if (rule.compareTo === "previous_period") {
        const compareStart = new Date(currentStart);
        compareStart.setDate(currentStart.getDate() - rule.windowDays);

        const compareMetrics = await (prisma as any).itemDailyMetrics.aggregate({
            where: {
                tenantId,
                productId: rule.productId || undefined,
                date: {
                    gte: compareStart,
                    lt: currentStart,
                }
            },
            _sum: {
                visits: true,
                orders: true,
                revenue: true,
            },
            _avg: {
                price: true,
                stock: true,
            }
        });
        compareVal = getValueFromAggregate(compareMetrics, rule.metric);
    } else if (rule.compareTo === "avg_30d") {
        const compareStart = new Date(now);
        compareStart.setDate(now.getDate() - 30);

        const compareMetrics = await (prisma as any).itemDailyMetrics.aggregate({
            where: {
                tenantId,
                productId: rule.productId || undefined,
                date: {
                    gte: compareStart,
                    lt: now,
                }
            },
            _avg: {
                visits: true,
                orders: true,
                revenue: true,
            }
        });
        // For avg_30d, we compare the sum of current window against (avg * windowDays)
        const dailyAvg = getValueFromAggregate(compareMetrics, rule.metric, true);
        compareVal = dailyAvg * rule.windowDays;
    }

    if (compareVal === 0) return false;

    const changePercent = ((currentVal - compareVal) / compareVal) * 100;

    if (rule.condition === "drop" && changePercent < -rule.threshold) {
        return true;
    }
    if (rule.condition === "spike" && changePercent > rule.threshold) {
        return true;
    }

    return false;
}

function getValueFromAggregate(agg: any, metric: string, isAvg = false): number {
    const base = isAvg ? agg._avg : (metric === "price" || metric === "stock" ? agg._avg : agg._sum);

    switch (metric) {
        case "visits": return base.visits || 0;
        case "orders": return base.orders || 0;
        case "revenue": return base.revenue || 0;
        case "price": return base.price || 0;
        case "stock": return base.stock || 0;
        default: return 0;
    }
}
