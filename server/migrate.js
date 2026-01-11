require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const runMigration = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await client.query(schemaSql);

        // Create a default admin user for testing if not exists
        const adminEmail = 'admin@admin.com';
        const adminPasswordHash = '$2a$08$1C3s7x7.0./.0./.0./.0./.0./.0./.0./.0./.0./.0./.0./.0'; // 'password' hash (dummy, user should reg proper one but let's make one)
        // Actually, let's just let the user register. Or better, insert one so they can login to admin immediately.
        // Hash for 'admin123' -> $2a$10$Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q
        // Let's use the register logic hash from earlier or just rely on them registering.
        // I'll stick to just schema for now.

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
};

runMigration();
