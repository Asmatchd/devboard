import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { logger } from "./requestLogger";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: z.treeifyError(err),
    });
    return;
  }

  if (err instanceof Error) {
    logger.error({ err }, err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  logger.error({ err }, "Unknown error occurred");
  res.status(500).json({ error: "Something went wrong" });
}
