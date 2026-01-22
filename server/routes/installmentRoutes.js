const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ==================== USER ENDPOINTS ====================

// Request installment for an order
router.post('/request', verifyToken, async (req, res) => {
    const { order_id, requested_installments, reason } = req.body;
    const userId = req.userId;

    try {
        // Validate input
        if (!order_id || !requested_installments) {
            return res.status(400).json({ message: 'Order ID and number of installments are required' });
        }

        if (requested_installments !== 2) {
            return res.status(400).json({ message: 'Only 2 installments are allowed' });
        }

        // Verify order exists and belongs to user
        const orderResult = await db.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [order_id, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Check if order is eligible (completed or pending)
        if (order.status !== 'completed' && order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not eligible for installments' });
        }

        // Check if request already exists for this order
        const existingRequest = await db.query(
            'SELECT * FROM installment_requests WHERE order_id = $1 AND status = $2',
            [order_id, 'pending']
        );

        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ message: 'An installment request already exists for this order' });
        }

        // Create installment request
        const result = await db.query(
            `INSERT INTO installment_requests 
             (user_id, order_id, total_amount, requested_installments, reason, status) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, order_id, order.total_amount, requested_installments, reason, 'pending']
        );

        res.status(201).json({
            message: 'Installment request submitted successfully',
            request: result.rows[0]
        });

    } catch (error) {
        console.error('Error creating installment request:', error);
        res.status(500).json({ message: 'Error creating installment request', error: error.message });
    }
});

// Get user's installment requests
router.get('/my-requests', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const result = await db.query(
            `SELECT ir.*, o.id as order_number 
             FROM installment_requests ir
             JOIN orders o ON ir.order_id = o.id
             WHERE ir.user_id = $1
             ORDER BY ir.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching installment requests:', error);
        res.status(500).json({ message: 'Error fetching installment requests', error: error.message });
    }
});

// Get user's active installments
router.get('/my-installments', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const result = await db.query(
            `SELECT i.*, ir.order_id, o.id as order_number
             FROM installments i
             JOIN installment_requests ir ON i.request_id = ir.id
             JOIN orders o ON i.order_id = o.id
             WHERE i.user_id = $1
             ORDER BY i.due_date ASC, i.installment_number ASC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching installments:', error);
        res.status(500).json({ message: 'Error fetching installments', error: error.message });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all pending installment requests
router.get('/requests/pending', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT ir.*, 
                    u.name as user_name, 
                    u.email as user_email,
                    o.id as order_number
             FROM installment_requests ir
             JOIN users u ON ir.user_id = u.id
             JOIN orders o ON ir.order_id = o.id
             WHERE ir.status = 'pending'
             ORDER BY ir.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Error fetching pending requests', error: error.message });
    }
});

// Get all installment requests (admin)
router.get('/requests/all', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT ir.*, 
                    u.name as user_name, 
                    u.email as user_email,
                    o.id as order_number
             FROM installment_requests ir
             JOIN users u ON ir.user_id = u.id
             JOIN orders o ON ir.order_id = o.id
             ORDER BY ir.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({ message: 'Error fetching all requests', error: error.message });
    }
});

// Approve installment request and create installment plan
router.post('/approve/:requestId', verifyAdmin, async (req, res) => {
    const { requestId } = req.params;
    const { installments, approvedTotal } = req.body; // Array of {amount, due_date}, and optional approvedTotal

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Get request details
        const requestResult = await client.query(
            'SELECT * FROM installment_requests WHERE id = $1',
            [requestId]
        );

        if (requestResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Request not found' });
        }

        const request = requestResult.rows[0];

        if (request.status !== 'pending') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Request has already been processed' });
        }

        // Validate installments
        if (!installments || installments.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Installments configuration is required' });
        }

        const totalInstallmentAmount = installments.reduce((sum, inst) => sum + parseFloat(inst.amount), 0);
        // Use approvedTotal if provided, otherwise default to original request amount
        const targetAmount = approvedTotal ? parseFloat(approvedTotal) : parseFloat(request.total_amount);

        if (Math.abs(totalInstallmentAmount - targetAmount) > 0.1) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                message: 'Total installment amount must equal the approved amount',
                expected: targetAmount,
                received: totalInstallmentAmount
            });
        }

        // Update total_amount if it changed
        if (approvedTotal && Math.abs(parseFloat(approvedTotal) - parseFloat(request.total_amount)) > 0.01) {
            await client.query(
                'UPDATE installment_requests SET total_amount = $1 WHERE id = $2',
                [approvedTotal, requestId]
            );
        }

        // Update request status
        await client.query(
            'UPDATE installment_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['approved', requestId]
        );

        // Create installments
        for (let i = 0; i < installments.length; i++) {
            await client.query(
                `INSERT INTO installments 
                 (request_id, order_id, user_id, installment_number, amount, due_date, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    requestId,
                    request.order_id,
                    request.user_id,
                    i + 1,
                    installments[i].amount,
                    installments[i].due_date,
                    'pending'
                ]
            );
        }

        await client.query('COMMIT');

        res.json({ message: 'Installment request approved successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error approving request:', error);
        res.status(500).json({ message: 'Error approving request', error: error.message });
    } finally {
        client.release();
    }
});

// Reject installment request
router.post('/reject/:requestId', verifyAdmin, async (req, res) => {
    const { requestId } = req.params;
    const { admin_notes } = req.body;

    try {
        const result = await db.query(
            `UPDATE installment_requests 
             SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3 AND status = $4
             RETURNING *`,
            ['rejected', admin_notes, requestId, 'pending']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found or already processed' });
        }

        res.json({ message: 'Installment request rejected', request: result.rows[0] });

    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ message: 'Error rejecting request', error: error.message });
    }
});

// Get all installments (admin dashboard)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT i.*, 
                    u.name as user_name,
                    u.email as user_email,
                    o.id as order_number,
                    ir.total_amount as order_total
             FROM installments i
             JOIN users u ON i.user_id = u.id
             JOIN orders o ON i.order_id = o.id
             JOIN installment_requests ir ON i.request_id = ir.id
             ORDER BY i.due_date ASC, i.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all installments:', error);
        res.status(500).json({ message: 'Error fetching all installments', error: error.message });
    }
});

module.exports = router;
