import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
    datasourceUrl: "postgresql://postgres.domvzhgpvkltobxbhjbp:Infinite-station%21@18.228.163.245:5432/postgres"
});

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@infinitestation.com";
    const password = process.env.ADMIN_PASSWORD || "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Ensure Default Tenant
    let tenant = await prisma.tenant.findFirst({ where: { slug: "loja-padrao" } });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: "Mega Store",
                slug: "loja-padrao",
                plan: "pro",
            },
        });
        console.log("Created Default Tenant:", tenant.name);
    }

    // 2. Upsert Admin User
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "SUPER_ADMIN",
            tenantId: tenant.id
        },
        create: {
            email,
            name: "Admin User",
            role: "SUPER_ADMIN",
            password: hashedPassword,
            tenantId: tenant.id
        },
    });

    console.log(`User ${user.email} created/updated with password: ${password}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
