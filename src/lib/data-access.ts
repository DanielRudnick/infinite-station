import { auth } from "@/lib/auth";

export async function getCurrentTenantId() {
    const session = await auth();

    if (!session?.user?.tenantId) {
        throw new Error("Unauthorized: Tenant ID not found");
    }

    return session.user.tenantId;
}

export async function getCurrentUser() {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Unauthorized: User not found");
    }

    return session.user;
}
