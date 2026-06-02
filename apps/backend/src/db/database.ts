import { Kysely, PostgresDialect, Generated, ColumnType } from "kysely";
import { Pool } from "pg";
import { env } from "../config/env";

interface TaskTable {
  id: Generated<string>;
  title: string;
  description: string | null;
  status: ColumnType<"todo" | "in_progress" | "done", "todo" | "in_progress" | "done" | undefined, "todo" | "in_progress" | "done">;
  assignee_id: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

interface UserTable {
  id: Generated<string>;
  email: string;
  name: string;
  password_hash: string;
  created_at: Generated<Date>;
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
