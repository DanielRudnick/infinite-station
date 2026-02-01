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
        try {
            const { isTriggered, changePercent } = await checkRule(rule, tenantId);

            if (isTriggered) {
                // Determine Severity based on threshold multiples
                // 1x threshold = WARNING, 2.5x threshold = DANGER
                const absChange = Math.abs(changePercent);
                let severity: "DANGER" | "WARNING" | "INFO" = "WARNING";

                if (absChange >= rule.threshold * 2.5) {
                    severity = "DANGER";
                } else if (absChange >= rule.threshold) {
                    severity = "WARNING";
                }

                // ANTI-SPAM: Cooldown and Escalation Logic
                const cooldownMs = rule.cooldownMinutes * 60 * 1000;
                const isWithinCooldown = rule.lastTriggered && (now.getTime() - rule.lastTriggered.getTime() < cooldownMs);

                // If within cooldown, only trigger if severity ESCALATED (e.g., from WARNING to DANGER)
                const isEscalation = severity === "DANGER" && rule.lastSeverity === "WARNING";
                const shouldTrigger = !isWithinCooldown || isEscalation;

                if (shouldTrigger) {
                    // Create Alert
                    await prisma.alert.create({
                        data: {
                            tenantId: rule.tenantId,
                            productId: rule.productId,
                            ruleId: rule.id,
                            title: `Alerta ${severity}: ${rule.metric.toUpperCase()} ${rule.condition}`,
                            description: `A métrica ${rule.metric} apresentou um(a) ${rule.condition} de ${Math.round(absChange)}% (Limite: ${rule.threshold}%).`,
                            severity,
                            ruleType: "AUTOMATIC",
                        } as any
                    });

                    // Update rule status
                    await (prisma as any).alertRule.update({
                        where: { id: rule.id },
                        data: {
                            lastTriggered: now,
                            lastSeverity: severity
                        }
                    });

                    results.push({ ruleId: rule.id, status: "triggered", severity });
                } else {
                    results.push({ ruleId: rule.id, status: "suppressed_by_cooldown" });
                }
            } else {
                // Reset last severity if rule is no longer triggered
                if (rule.lastTriggered) {
                    await (prisma as any).alertRule.update({
                        where: { id: rule.id },
                        data: { lastSeverity: null }
                    });
                }
                results.push({ ruleId: rule.id, status: "ok" });
            }
        } catch (e) {
            console.error(`Error evaluating rule ${rule.id}:`, e);
            results.push({ ruleId: rule.id, status: "error", error: String(e) });
        }
    }

    return results;
}

async function checkRule(rule: any, tenantId: string): Promise<{ isTriggered: boolean, changePercent: number }> {
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

    if (compareVal === 0) return { isTriggered: false, changePercent: 0 };

    const changePercent = ((currentVal - compareVal) / compareVal) * 100;

    if (rule.condition === "drop" && changePercent < -rule.threshold) {
        return { isTriggered: true, changePercent };
    }
    if (rule.condition === "spike" && changePercent > rule.threshold) {
        return { isTriggered: true, changePercent };
    }

    return { isTriggered: false, changePercent };
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
