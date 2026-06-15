const pool = require('../config/db');

// POST /api/orders — place a new order (protected)
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        // items = [{ product_id: 1, quantity: 2 }, { product_id: 3, quantity: 1 }]
        const userId = req.user.id; // Set by our auth middleware

        // 1. Calculate total from real DB prices (don't trust client-sent prices!)
        let total = 0;
        for (const item of items) {
            const product = await pool.query(
                'SELECT price FROM products WHERE id = $1', [item.product_id]
            );
            if (product.rows.length === 0) {
                return res.status(404).json({ message: `Product ${item.product_id} not found` });
            }
            total += product.rows[0].price * item.quantity;
        }

        // 2. Create the order record
        const order = await pool.query(
            'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *',
            [userId, total]
        );
        const orderId = order.rows[0].id;

        // 3. Insert each item into order_items table
        for (const item of items) {
            const product = await pool.query(
                'SELECT price FROM products WHERE id = $1', [item.product_id]
            );
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, product.rows[0].price]
            );
        }

        res.status(201).json({ message: 'Order placed successfully', order: order.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/orders/my — get logged-in user's orders (protected)
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createOrder, getMyOrders };