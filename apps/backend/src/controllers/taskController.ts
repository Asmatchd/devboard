import { Response } from "express";
import { z } from "zod";
import { db } from "../db/database";
import { AuthRequest } from "../middleware/auth";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  assigneeId: z.uuid().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assigneeId: z.uuid().nullable().optional(),
});

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  const tasks = await db
    .selectFrom("tasks")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  res.json({
    data: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      assigneeId: t.assignee_id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    })),
  });
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  const body = createTaskSchema.parse(req.body);

  const task = await db
    .insertInto("tasks")
    .values({
      title: body.title,
      description: body.description ?? null,
      status: body.status,
      assignee_id: body.assigneeId ?? null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  res.status(201).json({
    data: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: task.assignee_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    },
  });
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const body = updateTaskSchema.parse(req.body);

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.assigneeId !== undefined) updateData.assignee_id = body.assigneeId;

  const task = await db
    .updateTable("tasks")
    .set(updateData)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json({
    data: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: task.assignee_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    },
  });
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const task = await db
    .deleteFrom("tasks")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(204).send();
}
