const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_system',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  decimalNumbers: true,
  timezone: 'Z'
});

// Test connection helper
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'hotel_system');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL connection warning:', error.message);
    console.warn('Please make sure MySQL is running and database "hotel_system" is imported.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
