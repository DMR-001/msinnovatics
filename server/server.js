require('dotenv').config();
const express = require('express');
const cors = require('cors');


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

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin)
        if (!origin) {
            return callback(null, true);
        }

        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin); // Return the actual origin instead of true
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

app.enable('trust proxy'); // Important for Vercel/proxies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for form data parsing

const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


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

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
