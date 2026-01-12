const express = require('express');
const router = express.Router();
const ccav = require('../utils/ccav');
const qs = require('querystring');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/initiate', verifyToken, async (req, res) => {
    const { items, total_amount, userId } = req.body; // userId from verifiedToken if needed, or pass it? verifyToken adds req.userId
    const actualUserId = req.userId;

    // Debug Logs for Env Vars
    console.log('Initiating Payment...');
    console.log('MERCHANT_ID Present:', !!process.env.MERCHANT_ID);
    console.log('ACCESS_CODE Present:', !!process.env.ACCESS_CODE);
    console.log('WORKING_KEY Present:', !!process.env.WORKING_KEY);
    console.log('CCAVENUE_URL:', process.env.CCAVENUE_URL);

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

        const protocol = req.protocol;
        const host = req.get('host');
        // If in production (Vercel), host is usually correct. If behind proxy, trust proxy/x-forwarded-proto
        const baseUrl = `${protocol}://${host}`;

        // However, for Vercel, simpler to use logic:
        const redirectUrl = process.env.API_URL
            ? `${process.env.API_URL}/api/payment/response`
            : `${protocol}://${host}/api/payment/response`;

        const params = {
            merchant_id: process.env.MERCHANT_ID,
            order_id: orderId,
            currency: 'INR',
            amount: total_amount,
            redirect_url: redirectUrl,
            cancel_url: redirectUrl,
            language: 'EN',
            billing_name: req.body.billing_name || '',
            billing_email: req.body.billing_email || '',
            billing_tel: req.body.billing_tel || '',
            billing_country: 'India',
            delivery_name: req.body.billing_name || '',
            delivery_country: 'India'
            // Add other optional params (billing_name, etc.) if available in req.body
        };

        console.log('Payment Params:', JSON.stringify(params)); // Log params to check values

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

        let dbStatus = 'cancelled';
        if (status === 'Success') {
            dbStatus = 'completed';
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
