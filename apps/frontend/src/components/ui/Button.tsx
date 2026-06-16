import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg shadow-indigo-500/20",
    secondary:
      "bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]",
    ghost:
      "hover:bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
    danger:
      "bg-[var(--color-danger)]/10 hover:bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30",
  };

  const sizes = {
    sm: { padding: "6px 14px", fontSize: "13px", gap: "6px" },
    md: { padding: "9px 18px", fontSize: "14px", gap: "8px" },
    lg: { padding: "13px 24px", fontSize: "15px", gap: "8px" },
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{ ...sizes[size], ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ width: "14px", height: "14px" }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
