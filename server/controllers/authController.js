const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, hashedPassword, 'customer'] // Default role
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ user, token });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
