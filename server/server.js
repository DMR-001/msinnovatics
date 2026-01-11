require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
