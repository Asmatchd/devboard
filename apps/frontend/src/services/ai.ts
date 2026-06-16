import { api } from "./api";

export const aiService = {
  async generateDescription(title: string): Promise<string> {
    const res = await api.post<{ data: { description: string } }>("/ai/generate-description", { title });
    return res.data.data.description;
  },

  async breakdownGoal(goal: string): Promise<{ title: string; description: string }[]> {
    const res = await api.post<{ data: { tasks: { title: string; description: string }[] } }>("/ai/breakdown", { goal });
    return res.data.data.tasks;
  },
};
