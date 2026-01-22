const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sendMail } = require('../services/emailService');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create user with verified=false
        const result = await db.query(
            'INSERT INTO users (name, email, password, role, is_verified, otp_code, otp_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email',
            [name, email, hashedPassword, 'customer', false, otp, otpExpiry]
        );

        // Send OTP Email
        await sendMail({
            to: email,
            subject: 'Verify Your Email - MS Innovatics',
            text: `Your verification code is: ${otp}. Valid for 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Verify Your Email</h2>
                    <p>Thank you for registering with MS Innovatics.</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #2563EB; letter-spacing: 5px;">${otp}</h1>
                    <p>This code is valid for 10 minutes.</p>
                </div>
            `
        });

        res.status(201).json({ message: 'Registration successful. Please check your email for OTP.', email });

    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.otp_code !== otp || new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Verify User
        await db.query('UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expiry = NULL WHERE id = $1', [user.id]);

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Email verified successfully', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error: error.message });
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

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email address first.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
