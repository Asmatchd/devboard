export type TaskStatus = "todo" | "in_progress" | "done";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
}
