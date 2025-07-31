/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Daily work tasks management
 */

const express = require("express");
const router = express.Router();
const { sql, pool, poolConnect } = require("../db/mssql");

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks filtered by date field
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2025-07-31
 *         description: The date to filter by
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [start_date, due_date, created_at]
 *           default: start_date
 *         description: Field to filter and sort by
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction (ascending or descending)
 *     responses:
 *       200:
 *         description: List of filtered and sorted tasks
 */
router.get("/", async (req, res) => {
  const { date, field = "start_date", sort = "asc" } = req.query;
  await poolConnect;

  const allowedFields = ["start_date", "due_date", "created_at"];
  const allowedSort = ["asc", "desc"];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: "Invalid field parameter" });
  }

  if (!allowedSort.includes(sort.toLowerCase())) {
    return res.status(400).json({ error: "Invalid sort parameter" });
  }

  try {
    const query = `
      SELECT * FROM Tasks
      WHERE CAST(${field} AS DATE) = @date
      ORDER BY ${field} ${sort.toUpperCase()}
    `;

    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(query);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - start_date
 *               - due_date
 *               - status
 *             properties:
 *               type:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Build API route
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-31T09:00:00
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-31T11:00:00
 *               status:
 *                 type: string
 *                 enum: [in_progress, done, cancel]
 *                 example: in_progress
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", async (req, res) => {
  const { type, name, start_date, due_date, status } = req.body;
  await poolConnect;
  try {
    await pool.request()
      .input("type", sql.Int, type)
      .input("name", sql.NVarChar, name)
      .input("start_date", sql.DateTime, start_date)
      .input("due_date", sql.DateTime, due_date)
      .input("status", sql.NVarChar, status)
      .query(`
        INSERT INTO Tasks (type, name, start_date, due_date, status)
        VALUES (@type, @name, @start_date, @due_date, @status)
      `);
    res.status(201).json({ message: "Task created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - start_date
 *               - due_date
 *               - status
 *             properties:
 *               type:
 *                 type: integer
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: Update Swagger documentation
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T09:00:00
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T10:30:00
 *               status:
 *                 type: string
 *                 enum: [in_progress, done, cancel]
 *                 example: done
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { type, name, start_date, due_date, status } = req.body;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("type", sql.Int, type)
      .input("name", sql.NVarChar, name)
      .input("start_date", sql.DateTime, start_date)
      .input("due_date", sql.DateTime, due_date)
      .input("status", sql.NVarChar, status)
      .query(`
        UPDATE Tasks
        SET
          type = @type,
          name = @name,
          start_date = @start_date,
          due_date = @due_date,
          status = @status,
          updated_at = GETDATE()
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Tasks WHERE id = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
