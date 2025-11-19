const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones (Mejor rendimiento que una sola conexión)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify para usar async/await
const promisePool = pool.promise();

console.log("Conectado a la base de datos MySQL: " + process.env.DB_NAME);

module.exports = promisePool;