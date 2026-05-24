import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: z.treeifyError(err),
    });
    return;
  }

  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Something went wrong" });
}
