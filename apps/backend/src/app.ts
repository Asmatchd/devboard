import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger, logger } from "./middleware/requestLogger";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import aiRoutes from "./routes/ai";
import { db } from "./db/database";

export const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(requestLogger);

// Health check — is the server running?
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Readiness check — is the server ready to accept traffic?
// Checks database connectivity
app.get("/ready", async (req, res) => {
  try {
    await db.selectFrom("users").select("id").limit(1).execute();
    res.json({
      status: "ready",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    logger.error({ error }, "Database connection failed");
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

// Debug — remove after testing
// console.log("Routes registered:");
// console.log(app._router.stack.map((r: any) => r.regexp));

// Temporary debug
// app.get("/debug/routes", (req, res) => {
//   const routes: string[] = [];
//   app._router.stack.forEach((middleware: any) => {
//     if (middleware.route) {
//       routes.push(middleware.route.path);
//     } else if (middleware.name === "router") {
//       middleware.handle.stack.forEach((handler: any) => {
//         if (handler.route) {
//           routes.push(handler.route.path);
//         }
//       });
//     }
//   });
//   res.json(routes);
// });

// Error handler should be the last middleware
app.use(errorHandler);
