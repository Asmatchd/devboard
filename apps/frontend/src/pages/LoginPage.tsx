import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authService } from "../services/auth";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result =
        mode === "login"
          ? await authService.login(form.email, form.password)
          : await authService.register(form.email, form.name, form.password);

      setAuth(result.data.token, result.data.user);
      navigate("/");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-(--color-accent)/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4" style={{ maxWidth: "480px" }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: "48px" }}>
          <div
            className="inline-flex items-center justify-center rounded-2xl bg-(--color-accent) shadow-lg shadow-indigo-500/30"
            style={{ width: "64px", height: "64px", marginBottom: "20px" }}
          >
            <span className="text-white font-bold" style={{ fontSize: "28px" }}>
              D
            </span>
          </div>
          <h1
            className="font-bold text-(--color-text-primary)"
            style={{ fontSize: "32px" }}
          >
            DevBoard
          </h1>
          <p
            className="text-(--color-text-secondary)"
            style={{ fontSize: "15px", marginTop: "8px" }}
          >
            {mode === "login"
              ? "Sign in to your workspace"
              : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-2xl"
          style={{ padding: "40px" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            style={{ gap: "20px" }}
          >
            {mode === "register" && (
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="Asmat"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && (
              <div
                className="flex items-center gap-3 text-(--color-danger) bg-(--color-danger)/10 border border-(--color-danger)/20 rounded-lg"
                style={{ padding: "12px 16px" }}
              >
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <p style={{ fontSize: "13px", lineHeight: "1.5" }}>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              style={{ padding: "14px", fontSize: "15px", marginTop: "4px" }}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div
            className="text-center border-t border-(--color-border-subtle)"
            style={{ marginTop: "28px", paddingTop: "24px" }}
          >
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-sm text-(--color-text-secondary) hover:text-(--color-accent) transition-colors cursor-pointer"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
