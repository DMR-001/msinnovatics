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
        // robustness: try env var, then request origin (frontend), then fallback to host
        const origin = req.headers.origin;
        const frontendUrl = process.env.FRONTEND_URL || origin || `${protocol}://${host}`;

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
            billing_name: req.body.billing_info?.name || '',
            billing_email: req.body.billing_info?.email || '',
            billing_country: 'India', // Default to India as per user context
            billing_tel: '9999999999', // Placeholder if not collected, mandatory for some banks? Specs say optional but good to have
            // Ensure address/city/state are non-empty if sent, or omit.
            // CCAvenue doc says optional.

            // Best Practice #5: Instant Gratification (as per user request "N" or omit if unsure, actually user pasted docs showing it handles drop-offs)
            // We omit for now as default behavior is safer.
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
        const trackingId = data.tracking_id;
        const bankRefNo = data.bank_ref_no;
        const failureMessage = data.failure_message;
        const paymentMode = data.payment_mode;
        const cardName = data.card_name;
        const statusMessage = data.status_message;

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

        // Update DB with full details
        await db.query(
            `UPDATE orders 
             SET status = $1, 
                 tracking_id = $2, 
                 bank_ref_no = $3, 
                 failure_message = $4, 
                 payment_mode = $5, 
                 card_name = $6, 
                 status_message = $7,
                 currency = $8
             WHERE id = $9`,
            [
                dbStatus,
                trackingId,
                bankRefNo,
                failureMessage,
                paymentMode,
                cardName,
                statusMessage,
                responseCurrency,
                orderId
            ]
        );

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
