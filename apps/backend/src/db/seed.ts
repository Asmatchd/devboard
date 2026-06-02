import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { env } from "../config/env";

const pool = new Pool({ connectionString: env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();

  try {
    console.log("🌱 Seeding database...");

    // Create a test user
    const passwordHash = await bcrypt.hash("password123", 10);

    const userResult = await client.query(`
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, ["test@devboard.com", "Test User", passwordHash]);

    const userId = userResult.rows[0]?.id;

    if (userId) {
      // Create sample tasks
      await client.query(`
        INSERT INTO tasks (title, description, status, assignee_id) VALUES
        ($1, $2, 'todo', $3),
        ($4, $5, 'in_progress', $6),
        ($7, $8, 'done', $9)
      `, [
        "Set up authentication", "Implement JWT-based auth flow", userId,
        "Build task board UI", "Create drag-and-drop kanban board", userId,
        "Initialize project", "Set up monorepo with Docker", userId,
      ]);
    }

    console.log("✅ Seeding complete");
    console.log("📧 Test user: test@devboard.com");
    console.log("🔑 Password: password123");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
