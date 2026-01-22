const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// Lazy initialization of Razorpay instance
let razorpay = null;

function getRazorpayInstance() {
    if (!razorpay) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
        }

        razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
    }
    return razorpay;
}

// Initiate Payment (or Installment Request)
router.post('/initiate', verifyToken, async (req, res) => {
    const { items, total_amount, existing_order_id, payment_mode, installment_reason } = req.body;
    const actualUserId = req.userId;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        let orderId = existing_order_id;
        let order;

        if (orderId) {
            // Verify existing order ownership and status
            const orderResult = await client.query(
                'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
                [orderId, actualUserId]
            );

            if (orderResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Order not found or unauthorized' });
            }
            order = orderResult.rows[0];

            // If retrying, we allow pending or failed orders
            if (order.status === 'completed') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Order already completed' });
            }
        } else {
            // Create New Order
            const orderResult = await client.query(
                'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
                [actualUserId, total_amount, 'pending']
            );
            order = orderResult.rows[0];
            orderId = order.id;

            // Insert Order Items - handle legacy 'price' or 'price_at_purchase'
            for (const item of items) {
                const price = item.price || item.price_at_purchase;
                // Some implementations might use product_id or just id
                const productId = item.product_id || item.id;

                // FIXED: Column name is price_at_purchase, not price
                await client.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                    [orderId, productId, item.quantity, price]
                );
            }
        }

        // Handle Installment Payment Request
        if (payment_mode === 'installment') {
            // Check if request already exists
            const existingRequest = await client.query(
                'SELECT * FROM installment_requests WHERE order_id = $1',
                [orderId]
            );

            if (existingRequest.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Installment request already exists for this order.' });
            }

            // Create Installment Request (Fixed to 2 installments)
            await client.query(
                `INSERT INTO installment_requests 
                 (user_id, order_id, total_amount, requested_installments, reason, status) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [actualUserId, orderId, total_amount, 2, installment_reason || 'Checkout request', 'pending']
            );

            // Mark order as installment type
            await client.query(
                "UPDATE orders SET payment_mode = 'installment' WHERE id = $1",
                [orderId]
            );

            await client.query('COMMIT');

            return res.json({
                success: true,
                isInstallmentRequest: true,
                message: 'Installment request submitted successfully. Waiting for admin approval.',
                orderId: orderId
            });
        }

        // Standard Razorpay Payment Flow
        const razorpayInstance = getRazorpayInstance();
        const options = {
            amount: Math.round(total_amount * 100), // Amount in paise
            currency: "INR",
            receipt: `order_${orderId}_${Date.now()}`,
            payment_capture: 1,
            notes: {
                order_id: orderId,
                user_id: actualUserId
            }
        };

        const response = await razorpayInstance.orders.create(options);

        // Store Razorpay Order ID
        await client.query(
            'UPDATE orders SET bank_ref_no = $1 WHERE id = $2',
            [response.id, orderId]
        );

        await client.query('COMMIT');

        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: orderId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Payment initiation error:', error);
        res.status(500).json({ message: 'Error initiating payment', error: error.message });
    } finally {
        client.release();
    }
});

router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        // 1. Verify Razorpay Signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            console.error('Security Alert: Invalid Razorpay signature');
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // 2. Fetch Payment Details from Razorpay
        const razorpayInstance = getRazorpayInstance();
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        // 3. Verify Order exists and amount matches
        const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
        const order = orderResult.rows[0];

        if (!order) {
            console.error('Order not found for ID:', order_id);
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // 4. Verify Amount
        const orderAmount = Math.round(parseFloat(order.total_amount) * 100); // Convert to paise
        const paymentAmount = payment.amount;

        if (Math.abs(orderAmount - paymentAmount) > 1) { // Allow 1 paisa difference for rounding
            console.error(`Security Alert: Amount mismatch. Order: ${orderAmount}, Payment: ${paymentAmount}`);
            await db.query(
                'UPDATE orders SET status = $1, failure_message = $2 WHERE id = $3',
                ['failed', 'Amount mismatch', order_id]
            );
            return res.status(400).json({
                success: false,
                message: 'Payment amount mismatch'
            });
        }

        // 5. Update Order Status
        let dbStatus = 'completed';
        if (payment.status === 'captured' || payment.status === 'authorized') {
            dbStatus = 'completed';
        } else if (payment.status === 'failed') {
            dbStatus = 'failed';
        } else {
            dbStatus = 'pending';
        }

        await db.query(
            `UPDATE orders 
             SET status = $1, 
                 tracking_id = $2, 
                 payment_mode = $3, 
                 card_name = $4, 
                 status_message = $5,
                 currency = $6
             WHERE id = $7`,
            [
                dbStatus,
                razorpay_payment_id,
                payment.method,
                payment.card_id || payment.bank || payment.wallet || '',
                payment.status,
                payment.currency,
                order_id
            ]
        );

        res.json({
            success: true,
            orderId: order_id,
            paymentId: razorpay_payment_id,
            status: dbStatus
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});

// Webhook endpoint for Razorpay events (optional but recommended for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (webhookSignature !== expectedSignature) {
                console.error('Invalid webhook signature');
                return res.status(400).json({ message: 'Invalid signature' });
            }
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        // Handle different webhook events
        if (event === 'payment.captured') {
            // Payment was successful
            const orderId = payload.notes.order_id;
            if (orderId) {
                await db.query(
                    'UPDATE orders SET status = $1, tracking_id = $2 WHERE id = $3',
                    ['completed', payload.id, orderId]
                );
            }
        } else if (event === 'payment.failed') {
            // Payment failed
            const orderId = payload.notes.order_id;
            if (orderId) {
                await db.query(
                    'UPDATE orders SET status = $1, failure_message = $2 WHERE id = $3',
                    ['failed', payload.error_description, orderId]
                );
            }
        }

        res.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
});

// ==================== INSTALLMENT PAYMENT ENDPOINTS ====================

// Initiate installment payment
router.post('/installment/initiate/:installmentId', verifyToken, async (req, res) => {
    const { installmentId } = req.params;
    const userId = req.userId;

    try {
        const installmentResult = await db.query(
            'SELECT * FROM installments WHERE id = $1 AND user_id = $2',
            [installmentId, userId]
        );

        if (installmentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Installment not found' });
        }

        const installment = installmentResult.rows[0];

        if (installment.status === 'paid') {
            return res.status(400).json({ message: 'Installment already paid' });
        }

        const razorpayInstance = getRazorpayInstance();
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: Math.round(installment.amount * 100),
            currency: 'INR',
            receipt: `installment_${installmentId}_${Date.now()}`,
            notes: {
                installment_id: installmentId,
                order_id: installment.order_id,
                installment_number: installment.installment_number
            }
        });

        await db.query(
            'UPDATE installments SET razorpay_order_id = $1 WHERE id = $2',
            [razorpayOrder.id, installmentId]
        );

        res.json({
            installmentId: installmentId,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Installment payment initiation error:', error);
        res.status(500).json({ message: 'Error initiating installment payment', error: error.message });
    }
});

// Verify installment payment
router.post('/installment/verify', verifyToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, installment_id } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        const razorpayInstance = getRazorpayInstance();
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        const installmentResult = await db.query('SELECT * FROM installments WHERE id = $1', [installment_id]);
        if (installmentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Installment not found' });
        }

        const installment = installmentResult.rows[0];
        const installmentAmount = Math.round(parseFloat(installment.amount) * 100);

        if (Math.abs(installmentAmount - payment.amount) > 1) {
            return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
        }

        await db.query(
            'UPDATE installments SET status = $1, payment_id = $2, paid_at = CURRENT_TIMESTAMP WHERE id = $3',
            ['paid', razorpay_payment_id, installment_id]
        );

        const remainingInstallments = await db.query(
            'SELECT COUNT(*) as count FROM installments WHERE request_id = $1 AND status != $2',
            [installment.request_id, 'paid']
        );

        const allPaid = remainingInstallments.rows[0].count === '0';

        if (allPaid) {
            await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', installment.order_id]);
        }

        res.json({
            success: true,
            installmentId: installment_id,
            paymentId: razorpay_payment_id,
            allPaid: allPaid
        });

    } catch (error) {
        console.error('Installment payment verification error:', error);
        res.status(500).json({ success: false, message: 'Error verifying installment payment', error: error.message });
    }
});

module.exports = router;
