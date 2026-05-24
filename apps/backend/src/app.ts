import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);
