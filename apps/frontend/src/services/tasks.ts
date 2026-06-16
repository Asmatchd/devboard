import { api } from "./api";
import type { Task, TaskStatus } from "@devboard/shared";

interface TasksResponse {
  data: Task[];
}

interface TaskResponse {
  data: Task;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const res = await api.get<TasksResponse>("/tasks");
    return res.data.data;
  },

  async create(data: { title: string; description?: string; status?: TaskStatus }): Promise<Task> {
    const res = await api.post<TaskResponse>("/tasks", data);
    return res.data.data;
  },

  async update(id: string, data: { title?: string; description?: string; status?: TaskStatus }): Promise<Task> {
    const res = await api.patch<TaskResponse>(`/tasks/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
