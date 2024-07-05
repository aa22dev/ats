const config = require('../config/database.js');
const mysql = require('mysql2');

// Create a MySQL pool
const pool = mysql.createPool(config);

// Promisify the pool
const promisePool = pool.promise();

// Test the database connection
promisePool
  .query('SELECT 1')
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error: ', err));

module.exports = promisePool;