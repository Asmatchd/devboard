import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "../config/env";

interface TaskTable {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  assignee_id: string | null;
  created_at: Date;
  updated_at: Date;
}

interface UserTable {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

export interface Database {
  tasks: TaskTable;
  users: UserTable;
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
});
