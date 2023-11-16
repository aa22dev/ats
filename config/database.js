const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ats',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a MySQL pool
const pool = mysql.createPool(dbConfig);

// Promisify the pool
const promisePool = pool.promise();

// Test the database connection
promisePool
  .query('SELECT 1')
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = promisePool;
