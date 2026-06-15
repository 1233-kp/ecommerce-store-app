const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// When someone hits GET /api/products  → run getAllProducts
router.get('/', getAllProducts);

// When someone hits GET /api/products/3 → run getProductById
router.get('/:id', getProductById);

module.exports = router;