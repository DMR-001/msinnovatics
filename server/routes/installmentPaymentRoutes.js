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

// Initiate installment payment
router.post('/installment/initiate/:installmentId', verifyToken, async (req, res) => {
    const { installmentId } = req.params;
    const userId = req.userId;

    try {
        // Get installment details
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

        // Create Razorpay order for installment
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

        // Store Razorpay order ID
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

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('Invalid Razorpay signature for installment payment');
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Fetch payment details
        const razorpayInstance = getRazorpayInstance();
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        // Get installment details
        const installmentResult = await db.query(
            'SELECT * FROM installments WHERE id = $1',
            [installment_id]
        );

        if (installmentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Installment not found'
            });
        }

        const installment = installmentResult.rows[0];

        // Verify amount
        const installmentAmount = Math.round(parseFloat(installment.amount) * 100);
        if (Math.abs(installmentAmount - payment.amount) > 1) {
            console.error(`Amount mismatch for installment ${installment_id}`);
            return res.status(400).json({
                success: false,
                message: 'Payment amount mismatch'
            });
        }

        // Update installment status
        await db.query(
            `UPDATE installments 
             SET status = $1, payment_id = $2, paid_at = CURRENT_TIMESTAMP 
             WHERE id = $3`,
            ['paid', razorpay_payment_id, installment_id]
        );

        // Check if all installments are paid
        const remainingInstallments = await db.query(
            'SELECT COUNT(*) as count FROM installments WHERE request_id = $1 AND status != $2',
            [installment.request_id, 'paid']
        );

        const allPaid = remainingInstallments.rows[0].count === '0';

        // If all installments paid, update original order status
        if (allPaid) {
            await db.query(
                'UPDATE orders SET status = $1 WHERE id = $2',
                ['completed', installment.order_id]
            );
        }

        res.json({
            success: true,
            installmentId: installment_id,
            paymentId: razorpay_payment_id,
            allPaid: allPaid
        });

    } catch (error) {
        console.error('Installment payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying installment payment',
            error: error.message
        });
    }
});

module.exports = router;
