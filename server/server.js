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
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.options('*', cors()); // Enable pre-flight request for all routes

app.enable('trust proxy'); // Important for Vercel/proxies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for CCAvenue form POST

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
app.use('/api/payment', paymentRoutes); // Must handle POST from CCAvenue

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
