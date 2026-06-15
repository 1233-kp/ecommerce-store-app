const pool = require('../config/db');

// GET /api/products — fetch all products
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );
        res.json(result.rows); // result.rows is the array of products
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/products/:id — fetch one product by its ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // :id from the URL
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1', [id]
            // $1 is a placeholder — prevents SQL injection attacks
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllProducts, getProductById };