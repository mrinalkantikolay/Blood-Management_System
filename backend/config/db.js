// backend/config/db.js
const mysql = require('mysql2');

console.log('Attempting to connect to MySQL with:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ? '***' : '',
  database: process.env.DB_NAME || 'blood_management',
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'blood_management',
  connectTimeout: 10000, // 10 seconds
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.code, err.message, err.stack);
  } else {
    console.log('MySQL connection established successfully.');
  }
});

// Patch the promise query method to add timeout and error logging
const promiseConn = connection.promise();
const originalQuery = promiseConn.query.bind(promiseConn);
promiseConn.query = async function(sql, values) {
  const queryStr = sql;
  const queryVals = values;
  const queryOptions = {
    sql: queryStr,
    timeout: 10000, // 10 seconds
  };
  console.log('[DB] Executing query:', queryStr, queryVals ? queryVals : '');
  try {
    const result = await originalQuery(queryOptions, queryVals);
    return result;
  } catch (err) {
    console.error('[DB] Query error:', err.code, err.message, err.stack);
    throw err;
  }
};

module.exports = promiseConn;