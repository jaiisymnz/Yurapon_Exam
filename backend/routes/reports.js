/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Worklog reports
 */

const express = require("express");
const router = express.Router();
const { sql, pool, poolConnect } = require("../db/mssql");
const dayjs = require("dayjs");

/**
 * @swagger
 * /api/reports/daily:
 *   get:
 *     summary: Daily worklog report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-08-01
 *         description: Date to generate the report for (default is today)
 *     responses:
 *       200:
 *         description: Daily report summary
 */
router.get("/daily", async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await poolConnect;

  try {
    const result = {};

    // 1. งานใหม่วันนี้
    const newTasks = await pool.request()
      .input("date", sql.Date, date)
      .query(`SELECT COUNT(*) AS count FROM Tasks WHERE CAST(created_at AS DATE) = @date`);
    result.new_tasks = newTasks.recordset[0].count;

    // 2. งานถึงกำหนดส่งวันนี้
    const dueToday = await pool.request()
      .input("date", sql.Date, date)
      .query(`SELECT COUNT(*) AS count FROM Tasks WHERE CAST(due_date AS DATE) = @date`);
    result.due_today = dueToday.recordset[0].count;

    // 3. จำนวนงานที่อยู่ในวันนี้ (start <= date <= due)
    const totalToday = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT COUNT(*) AS count
        FROM Tasks
        WHERE CAST(start_date AS DATE) <= @date
          AND CAST(due_date AS DATE) >= @date
      `);
    result.total_tasks_today = totalToday.recordset[0].count;

    // 4. รายการงานที่อยู่ในวันนี้
    const tasksToday = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT t.*, ty.name AS type_name
        FROM Tasks t
        JOIN Types ty ON t.type = ty.id
        WHERE CAST(start_date AS DATE) <= @date
          AND CAST(due_date AS DATE) >= @date
        ORDER BY t.start_date
      `);
    result.tasks_today = tasksToday.recordset;

    res.json({
      date,
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Get task status summary for a month
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2025-08
 *         description: The month to summarize status (format YYYY-MM)
 *     responses:
 *       200:
 *         description: Summary of task statuses in that month
 */
router.get("/monthly", async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: "Missing month parameter" });

  const start = dayjs(`${month}-01`).startOf("month").format("YYYY-MM-DD");
  const end = dayjs(start).endOf("month").format("YYYY-MM-DD");

  await poolConnect;
  try {
    // สรุปงานแยกตาม status
    const statusResult = await pool.request()
      .input("start", sql.Date, start)
      .input("end", sql.Date, end)
      .query(`
        SELECT status, COUNT(*) AS total
        FROM Tasks
        WHERE CAST(start_date AS DATE) BETWEEN @start AND @end
        GROUP BY status
      `);

    const status_summary = {
        done: 0,
        in_progress: 0,
        cancel: 0
        };

    statusResult.recordset.forEach((row) => {
      status_summary[row.status] = row.total;
    });

    // นับงานทั้งหมดในเดือน
    const totalResult = await pool.request()
      .input("start", sql.Date, start)
      .input("end", sql.Date, end)
      .query(`
        SELECT COUNT(*) AS total
        FROM Tasks
        WHERE CAST(start_date AS DATE) BETWEEN @start AND @end
      `);

    const total_tasks = totalResult.recordset[0].total;

    res.json({
      month,
      total_tasks,
      status_summary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;