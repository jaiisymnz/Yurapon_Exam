const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Worklog API",
      version: "1.0.0",
      description: "API for managing daily worklogs"
    },
    servers: [
      { url: "http://localhost:3000" }
    ]
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/reports", require("./routes/reports"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
});
