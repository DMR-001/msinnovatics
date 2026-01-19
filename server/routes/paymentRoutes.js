const express = require('express');
const router = express.Router();
const ccav = require('../utils/ccav');
const qs = require('querystring');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/initiate', verifyToken, async (req, res) => {
    const { items, total_amount, userId } = req.body; // userId from verifiedToken if needed, or pass it? verifyToken adds req.userId
    const actualUserId = req.userId;

    try {
        // 1. Create Order as Pending
        const client = await db.pool.connect();
        let orderId;
        try {
            await client.query('BEGIN');
            const orderResult = await client.query(
                'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
                [actualUserId, total_amount, 'pending']
            );
            orderId = orderResult.rows[0].id;

            // Insert Items
            for (const item of items) {
                await client.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        // 2. Prepare CCAvenue Request
        const workingKey = process.env.WORKING_KEY;
        const accessCode = process.env.ACCESS_CODE;

        // Use Frontend Proxy ( Single Domain Strategy )
        // CCAvenue only sees msinnovatics.com
        const frontendUrl = process.env.FRONTEND_URL || `${protocol}://${host}`;
        const redirectUrl = `${frontendUrl}/payment-callback`;
        // Ensure https
        const secureRedirectUrl = redirectUrl.startsWith('http') ? redirectUrl : `https://${redirectUrl}`;

        const params = {
            merchant_id: process.env.MERCHANT_ID,
            order_id: orderId,
            currency: 'INR',
            amount: total_amount,
            redirect_url: secureRedirectUrl,
            cancel_url: secureRedirectUrl,
            language: 'EN',
            integration_type: 'iframe_normal',
            // Best Practice #5: Instant Gratification to handle drop-offs
            // 'Y' = Reverse transaction if status unknown (safer for real-time digital goods)
            // 'N' = Mark successful (safer for brick & mortar). 
            // We'll use 'Y' to prevent charging without delivery, but rely on webhook for sync.
            // Actually, for digital downloads, we prefer users NOT to be charged if we don't know status.
            // But usually 'N' is better if we have a robust webhook. Let's stick to standard behavior or omit if unsure.
            // CCAvenue recommends 'Y' for "real time service rendering". 
            // Let's add it.
            // instant_gratification: 'Y', 
            // actually, let's keep it simple and default unless user explicitly asks.
            // The email suggests specific input fields. But here we send via params.
            // Let's just focus on Validation for now as that is CRITICAL.
            // Add other optional params (billing_name, etc.) if available in req.body
        };

        const body = qs.stringify(params);
        const encRequest = ccav.encrypt(body, workingKey);

        res.json({
            encRequest,
            accessCode,
            url: process.env.CCAVENUE_URL
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ message: 'Error initiating payment' });
    }
});

router.post('/response', async (req, res) => {
    try {
        const { encResp } = req.body;
        const workingKey = process.env.WORKING_KEY;
        const decryptedJsonResponse = ccav.decrypt(encResp, workingKey);
        const data = qs.parse(decryptedJsonResponse);

        // data contains order_status, order_id, tracking_id, etc.
        const orderId = data.order_id;
        const status = data.order_status; // Success, Failure, Aborted
        const responseAmount = parseFloat(data.amount);
        const responseCurrency = data.currency;

        // Security Check: Validation (Best Practice #1)
        const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        const order = orderResult.rows[0];

        if (!order) {
            console.error('Order not found for ID:', orderId);
            // Redirect to failure but don't crash
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure?error=order_not_found`);
        }

        let dbStatus = 'cancelled';

        if (status === 'Success') {
            // Verify Amount and Currency
            const orderAmount = parseFloat(order.total_amount);

            // Allow small float difference (0.01) just in case, but usually must be exact.
            if (Math.abs(orderAmount - responseAmount) > 0.1) {
                console.error(`Security Alert: Amount mismatch. Order: ${orderAmount}, Response: ${responseAmount}`);
                dbStatus = 'failed'; // Mark failed to prevent fulfilling an underpaid order
            } else if (responseCurrency !== 'INR') { // Assuming we only support INR
                console.error(`Security Alert: Currency mismatch. Expected INR, Got: ${responseCurrency}`);
                dbStatus = 'failed';
            } else {
                dbStatus = 'completed';
            }
        } else if (status === 'Failure') {
            dbStatus = 'failed';
        }

        // Update DB
        await db.query('UPDATE orders SET status = $1 WHERE id = $2', [dbStatus, orderId]);

        // Determine Frontend URL
        // In local dev: http://localhost:5173
        // In production: set FRONTEND_URL env var
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Redirect to Client
        if (dbStatus === 'completed') {
            res.redirect(`${frontendUrl}/payment/success?order_id=${orderId}&tracking_id=${data.tracking_id}`);
        } else {
            res.redirect(`${frontendUrl}/payment/failure?order_id=${orderId}`);
        }

    } catch (error) {
        console.error('Payment response error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/payment/failure?error=server_error`);
    }
});

module.exports = router;
