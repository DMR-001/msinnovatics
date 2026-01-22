const db = require('../db');

exports.getAllProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { title, description, price, image_url, category, stock } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (title, description, price, image_url, category, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, price, image_url, category, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, image_url, category, stock } = req.body;
    try {
        const result = await db.query(
            'UPDATE products SET title = $1, description = $2, price = $3, image_url = $4, category = $5, stock = $6 WHERE id = $7 RETURNING *',
            [title, description, price, image_url, category, stock, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

exports.updateProductSpecifications = async (req, res) => {
    const { id } = req.params;
    const { specifications } = req.body;

    try {
        if (typeof specifications !== 'object') {
            return res.status(400).json({ message: 'Specifications must be a valid JSON object' });
        }

        const result = await db.query(
            'UPDATE products SET specifications = $1 WHERE id = $2 RETURNING *',
            [JSON.stringify(specifications), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product specifications updated successfully', product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product specifications', error: error.message });
    }
};
