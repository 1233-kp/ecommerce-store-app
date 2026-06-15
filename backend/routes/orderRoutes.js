const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Both routes are protected — user must be logged in
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

module.exports = router;