-- Installment Payment System Database Migration
-- Run this script on your Neon database

-- 1. Create installment_requests table
CREATE TABLE IF NOT EXISTS installment_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    requested_installments INTEGER NOT NULL CHECK (requested_installments = 2),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create installments table
CREATE TABLE IF NOT EXISTS installments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES installment_requests(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL CHECK (installment_number > 0),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(request_id, installment_number)
);

-- 3. Add specifications column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}';

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_installment_requests_user_id ON installment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_installment_requests_order_id ON installment_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_installment_requests_status ON installment_requests(status);

CREATE INDEX IF NOT EXISTS idx_installments_user_id ON installments(user_id);
CREATE INDEX IF NOT EXISTS idx_installments_order_id ON installments(order_id);
CREATE INDEX IF NOT EXISTS idx_installments_status ON installments(status);
CREATE INDEX IF NOT EXISTS idx_installments_request_id ON installments(request_id);

-- 5. Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_installment_requests_updated_at 
    BEFORE UPDATE ON installment_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Migration complete
-- Tables created: installment_requests, installments
-- Products table updated with specifications column
