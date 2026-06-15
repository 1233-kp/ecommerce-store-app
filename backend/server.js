const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security
const helmet = require('helmet');
app.use(helmet()); // Sets secure HTTP headers automatically

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiters
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, please try again later.' }
});

app.use(globalLimiter);
app.use('/api/auth', authLimiter);

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'E-commerce API is running!' });
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);

    res.status(500).json({
        message: 'Something went wrong on the server',
        error:
            process.env.NODE_ENV === 'development'
                ? err.message
                : undefined
    });
});

// Handle requests to routes that don't exist
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});