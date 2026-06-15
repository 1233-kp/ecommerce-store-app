const { Pool } = require('pg');
require('dotenv').config();

// Pool = a collection of reusable database connections
// Instead of opening/closing a connection for every request,
// we keep a pool ready to use

const pool = new Pool({
    user: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to PostgreSQL database!');
        release(); // Release the client back to the pool
    }
});

module.exports = pool;