import { Client } from 'pg';
import bcrypt from 'bcrypt';

const connectionString = "postgresql://postgres.domvzhgpvkltobxbhjbp:Infinite-station%21@18.228.163.245:5432/postgres";

async function main() {
    console.log("Connecting to database...");
    const client = new Client({ connectionString });
    await client.connect();

    try {
        const email = process.env.ADMIN_EMAIL || "admin@infinitestation.com";
        const password = process.env.ADMIN_PASSWORD || "password123";
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = "Admin User";

        console.log(`Seeding user: ${email}`);

        // 1. Ensure Tenant
        const tenantRes = await client.query(`
            INSERT INTO "Tenant" (id, name, slug, plan, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), 'Mega Store', 'loja-padrao', 'pro', NOW(), NOW())
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id;
        `);
        const tenantId = tenantRes.rows[0].id;
        console.log("Tenant ID:", tenantId);

        // 2. Upsert User
        // Note: Prisma uses cuid() for IDs by default, but we can use gen_random_uuid() or similar if current ID is UUID.
        // If Prisma schema uses CUID, we should generate one. 
        // Let's check schema. User id is CUID (String). 
        // We can just generate a random string or UUID, postgres doesn't care if it's string.

        await client.query(`
            INSERT INTO "User" (id, email, name, role, password, "tenantId", "createdAt", "updatedAt")
            VALUES (gen_random_uuid()::text, $1, $2, 'SUPER_ADMIN', $3, $4, NOW(), NOW())
            ON CONFLICT (email) DO UPDATE SET 
                password = $3,
                role = 'SUPER_ADMIN',
                "tenantId" = $4,
                "updatedAt" = NOW();
        `, [email, name, hashedPassword, tenantId]);

        console.log("User seeded successfully!");

    } catch (err) {
        console.error("Error seeding:", err);
    } finally {
        await client.end();
    }
}

main();
