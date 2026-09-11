const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// SSL config — tumia tu kama DB_SSL=true (kwa TiDB)
let sslConfig = false;
if (process.env.DB_SSL === 'true') {
    try {
        sslConfig = {
            ca: fs.readFileSync(
                path.join(__dirname, '..', 'isrgrootx1.pem')
            ),
            rejectUnauthorized: true,
        };
    } catch (err) {
        console.error('  Could not read CA cert. Falling back to no SSL.');
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log(' Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error(' Database connection failed:', err.message);
    });

module.exports = pool;