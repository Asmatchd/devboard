import { Response } from "express";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";

// Initialize client lazily — only when API key is available
function getClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

const generateDescriptionSchema = z.object({
  title: z.string().min(1),
});

const breakdownSchema = z.object({
  goal: z.string().min(1),
});

export async function generateTaskDescription(req: AuthRequest, res: Response): Promise<void> {
  const { title } = generateDescriptionSchema.parse(req.body);

  const client = getClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are a helpful project management assistant. Generate a clear, concise task description for the following task title. Keep it to 2-3 sentences, practical and actionable.

Task title: "${title}"

Respond with only the description, no extra formatting or explanation.`,
      },
    ],
  });

  const description = message.content[0].type === "text" ? message.content[0].text : "";
  res.json({ data: { description } });
}

export async function breakdownTask(req: AuthRequest, res: Response): Promise<void> {
  const { goal } = breakdownSchema.parse(req.body);

  const client = getClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are a helpful project management assistant. Break down the following goal into smaller, actionable tasks suitable for a kanban board. Return a JSON array of task objects with "title" and "description" fields. Maximum 6 tasks.

Goal: "${goal}"

Respond with only valid JSON array, no markdown, no explanation. Example format:
[{"title": "Task title", "description": "Task description"}]`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "[]";

  try {
    const tasks = JSON.parse(text);
    res.json({ data: { tasks } });
  } catch {
    res.status(500).json({ error: "Failed to parse AI response" });
  }
}
