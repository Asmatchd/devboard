import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "./ui/Button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Navbar */}
      <header
        className="border-b border-(--color-border-subtle) bg-(--color-surface)/80 backdrop-blur-sm sticky top-0 z-40"
        style={{ height: "60px" }}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{ padding: "0 40px" }}
        >
          <div className="flex items-center" style={{ gap: "12px" }}>
            <div
              className="rounded-lg bg-(--color-accent) flex items-center justify-center shadow-md shadow-indigo-500/30"
              style={{ width: "32px", height: "32px" }}
            >
              <span
                className="text-white font-bold"
                style={{ fontSize: "16px" }}
              >
                D
              </span>
            </div>
            <span
              className="font-semibold text-(--color-text-primary)"
              style={{ fontSize: "16px" }}
            >
              DevBoard
            </span>
          </div>

          <div className="flex items-center" style={{ gap: "16px" }}>
            {user && (
              <span
                className="text-(--color-text-secondary)"
                style={{ fontSize: "14px" }}
              >
                {user.name}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ padding: "48px 40px" }}>{children}</main>
    </div>
  );
}
