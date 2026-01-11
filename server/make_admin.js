require('dotenv').config();
const { Client } = require('pg');

const email = process.argv[2];

if (!email) {
    console.log('Usage: node make_admin.js <email>');
    process.exit(1);
}

const makeAdmin = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('UPDATE users SET role = $1 WHERE email = $2 RETURNING *', ['admin', email]);

        if (res.rows.length > 0) {
            console.log(`Success! User ${email} is now an admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await client.end();
    }
};

makeAdmin();
