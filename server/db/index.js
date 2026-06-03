require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Auto-migration to add missing columns
const runMigration = async () => {
    try {
        const client = await pool.connect();
        try {
            await client.query(`
                ALTER TABLE orders
                ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(50),
                ADD COLUMN IF NOT EXISTS bank_ref_no VARCHAR(50),
                ADD COLUMN IF NOT EXISTS failure_message TEXT,
                ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50),
                ADD COLUMN IF NOT EXISTS card_name VARCHAR(50),
                ADD COLUMN IF NOT EXISTS status_message TEXT,
                ADD COLUMN IF NOT EXISTS currency VARCHAR(10);

                ALTER TABLE products
                ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}',
                ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
                ADD COLUMN IF NOT EXISTS specifications_text TEXT,
                ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

                CREATE TABLE IF NOT EXISTS internship_certificates (
                    id SERIAL PRIMARY KEY,
                    certificate_id VARCHAR(50) UNIQUE NOT NULL,
                    intern_name VARCHAR(200) NOT NULL,
                    domain VARCHAR(200) NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    duration VARCHAR(100) NOT NULL,
                    performance VARCHAR(100) DEFAULT 'Good',
                    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
                    created_at TIMESTAMP DEFAULT NOW()
                );
            `);
            console.log('Database migration completed: Added tracking columns to orders.');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
};

runMigration();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool // Export pool if needed for transactions
};
