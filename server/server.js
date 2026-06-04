require('dotenv').config();
const express = require('express');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Middleware
const allowedOrigins = [
    'https://msinnovatics.vercel.app',
    'https://msinnovatics.com',
    'https://www.msinnovatics.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.enable('trust proxy');

// Manual CORS — always reads Origin from the live request, never cached
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Vary', 'Origin');
    // Prevent CDN/Vercel edge from caching API responses
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.enable('trust proxy'); // Important for Vercel/proxies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for form data parsing

const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const installmentRoutes = require('./routes/installmentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');


// Test DB Connection
db.query('SELECT NOW()', (err, result) => {
    if (err) {
        return console.error('Error executing query', err.stack);
    }
    console.log('Connected to Database at:', result.rows[0].now);
});

// Basic Route
app.get('/', (req, res) => {
    res.send('MS Innovatics E-commerce API');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // Razorpay payment routes
app.use('/api/installments', installmentRoutes); // Installment payment routes
app.use('/api/certificates', certificateRoutes); // Internship certificate routes

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
