import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db/database";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function register(req: Request, res: Response): Promise<void> {
  const body = registerSchema.parse(req.body);

  const existingUser = await db
    .selectFrom("users")
    .select("id")
    .where("email", "=", body.email)
    .executeTakeFirst();

  if (existingUser) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await db
    .insertInto("users")
    .values({
      email: body.email,
      name: body.name,
      password_hash: passwordHash,
    })
    .returning(["id", "email", "name", "created_at"])
    .executeTakeFirstOrThrow();

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
    },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const body = loginSchema.parse(req.body);

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", body.email)
    .executeTakeFirst();

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const validPassword = await bcrypt.compare(body.password, user.password_hash);

  if (!validPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
    },
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await db
    .selectFrom("users")
    .select(["id", "email", "name", "created_at"])
    .where("id", "=", req.userId!)
    .executeTakeFirst();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
  });
}
