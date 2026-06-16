import { api } from "./api";
import type { User } from "@devboard/shared";

interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

export const authService = {
  async register(email: string, name: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", { email, name, password });
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  },

  async me(): Promise<{ data: User }> {
    const res = await api.get<{ data: User }>("/auth/me");
    return res.data;
  },
};
