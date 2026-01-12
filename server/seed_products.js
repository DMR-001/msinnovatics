require('dotenv').config();
const { Client } = require('pg');

const products = [
    {
        title: 'School Management System (MERN)',
        description: 'Complete school management system with Student, Teacher, and Admin modules. Built with React and Node.js.',
        price: 4999.00,
        category: 'Web App',
        image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
        stock: 100
    },
    {
        title: 'AI Attendance System',
        description: 'Face recognition based attendance system using Python, OpenCV and Flask. Real-time detection.',
        price: 2499.00,
        category: 'AI/ML',
        image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
        stock: 100
    },
    {
        title: 'E-commerce Platform',
        description: 'Scalable e-commerce solution with cart, payment gateway, and admin dashboard. React & PostgreSQL.',
        price: 3999.00,
        category: 'Web App',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
        stock: 100
    },
    {
        title: 'Hospital Management System',
        description: 'Manage patients, doctors, and appointments efficiently. Includes billing and reporting modules.',
        price: 5999.00,
        category: 'Enterprise',
        image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        stock: 100
    },
    {
        title: 'Library Management System',
        description: 'Simple and effective library system to track books, issues, and returns.',
        price: 1499.00,
        category: 'Desktop App',
        image_url: 'https://images.unsplash.com/photo-1507842217153-e52fbc0f0b62?auto=format&fit=crop&q=80&w=800',
        stock: 100
    }
];

const seedProducts = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        for (const p of products) {
            await client.query(
                'INSERT INTO products (title, description, price, image_url, category, stock) VALUES ($1, $2, $3, $4, $5, $6)',
                [p.title, p.description, p.price, p.image_url, p.category, p.stock]
            );
        }

        console.log(`Seeded ${products.length} products successfully.`);
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await client.end();
    }
};

seedProducts();
