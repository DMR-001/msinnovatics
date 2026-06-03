const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Auto-create certificates table on first load
const initTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS internship_certificates (
            id SERIAL PRIMARY KEY,
            certificate_id VARCHAR(50) UNIQUE NOT NULL,
            intern_name VARCHAR(200) NOT NULL,
            domain VARCHAR(200) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            duration VARCHAR(100) NOT NULL,
            performance VARCHAR(100) DEFAULT 'Good',
            issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
};
initTable().catch(console.error);

// Generate unique certificate ID: MSI-YYYY-XXXXXX
const generateCertId = () => {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MSI-${year}-${rand}`;
};

// POST /api/certificates — issue a new certificate (admin only)
router.post('/', verifyAdmin, async (req, res) => {
    const { intern_name, domain, start_date, end_date, duration, performance } = req.body;
    if (!intern_name || !domain || !start_date || !end_date || !duration) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let certificate_id;
    let attempts = 0;
    // Retry on collision (extremely unlikely)
    while (attempts < 5) {
        certificate_id = generateCertId();
        const existing = await db.query('SELECT id FROM internship_certificates WHERE certificate_id = $1', [certificate_id]);
        if (existing.rows.length === 0) break;
        attempts++;
    }

    const result = await db.query(
        `INSERT INTO internship_certificates
            (certificate_id, intern_name, domain, start_date, end_date, duration, performance, issued_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE)
         RETURNING *`,
        [certificate_id, intern_name, domain, start_date, end_date, duration, performance || 'Good']
    );
    res.status(201).json(result.rows[0]);
});

// GET /api/certificates — list all (admin only)
router.get('/', verifyAdmin, async (req, res) => {
    const result = await db.query(
        'SELECT * FROM internship_certificates ORDER BY created_at DESC'
    );
    res.json(result.rows);
});

// GET /api/certificates/:certId — public verify endpoint
router.get('/:certId', async (req, res) => {
    const result = await db.query(
        'SELECT * FROM internship_certificates WHERE certificate_id = $1',
        [req.params.certId]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Certificate not found.' });
    }
    res.json(result.rows[0]);
});

// DELETE /api/certificates/:certId — revoke (admin only)
router.delete('/:certId', verifyAdmin, async (req, res) => {
    const result = await db.query(
        'DELETE FROM internship_certificates WHERE certificate_id = $1 RETURNING id',
        [req.params.certId]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Certificate not found.' });
    }
    res.json({ message: 'Certificate revoked.' });
});

module.exports = router;
