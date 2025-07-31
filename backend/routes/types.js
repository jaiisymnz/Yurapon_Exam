const express = require("express");
const router = express.Router();
const { pool, poolConnect } = require("../db/mssql");

router.get("/", async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query(`SELECT * FROM Types`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
