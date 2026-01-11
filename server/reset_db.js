require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const resetDb = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Drop existing tables
        console.log('Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS order_items CASCADE');
        await client.query('DROP TABLE IF EXISTS orders CASCADE');
        await client.query('DROP TABLE IF EXISTS products CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');

        // Read schema
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Run schema
        console.log('Re-creating tables...');
        await client.query(schemaSql);

        console.log('Database reset successfully.');
    } catch (err) {
        console.error('Reset failed:', err);
    } finally {
        await client.end();
    }
};

resetDb();
