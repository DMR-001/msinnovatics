const db = require('../db');

exports.createOrder = async (req, res) => {
    const { items, total_amount } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    // Transaction
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Create Order
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id',
            [userId, total_amount]
        );
        const orderId = orderResult.rows[0].id;

        // Create Order Items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error creating order', error: error.message });
    } finally {
        client.release();
    }
};

exports.getUserOrders = async (req, res) => {
    const userId = req.userId;
    try {
        const result = await db.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error: error.message });
    }
};

exports.getOrderItems = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.userId;

    try {
        // Verify the order belongs to the user
        const orderCheck = await db.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found or unauthorized' });
        }

        // Get order items
        const result = await db.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [orderId]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order items', error: error.message });
    }
};
