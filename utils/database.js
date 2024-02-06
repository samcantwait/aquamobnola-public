// Database connection
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  user: "*****",
  password: process.env.PASS_MYSQL,
  database: "*****",
});

module.exports = pool;
