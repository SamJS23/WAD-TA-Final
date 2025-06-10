import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";

import swaggerSpec from './utils/swagger.js';

import todoRoute from "./routes/todoRoute.js";
import usersRoute from "./routes/usersRoute.js";

const app = express();
dotenv.config();

app.use(express.json()); // Built-in body-parser for parsing JSON

// Fixed CORS middleware setup:
app.use(
  cors({
    origin: 'https://e2425-wads-l4ccg5-setiadi.csbihub.id',
    credentials: true,
  })
);

app.use(cookieParser()); // Enable cookie parsing

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;

app.use("/service/todo", todoRoute);
app.use("/service/user", usersRoute);

// API documentation endpoint
app.use(
  "/todolist/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Todo List Management API",
  })
);

mongoose.set("strictQuery", true);

// Start the server
mongoose
  .connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));
