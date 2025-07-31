const sql = require("mssql");

const config = {
  user: "sa",
  password: "123456789",
  server: "localhost", 
  database: "exam",
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = { sql, pool, poolConnect };
