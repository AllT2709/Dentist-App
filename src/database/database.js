const mysql = require("mysql2");
const config = require("../../config/index");

let pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.userDB,
  password: config.password,
  database: config.database,
});

module.exports = pool;
