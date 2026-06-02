import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import aiRoutes from "./routes/ai";

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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
