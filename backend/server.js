import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./db/index.js";
import employeeRouter from "./routes/employee.routes.js";
import authRouter from "./routes/auth.routes.js";
import verifyJWT from "./middlewares/auth.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/employees", verifyJWT, employeeRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => console.log("DB connection failed", err));