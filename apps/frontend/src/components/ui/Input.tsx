import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col" style={{ gap: "8px" }}>
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg text-sm
            bg-[var(--color-surface-raised)]
            border border-[var(--color-border)]
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            outline-none
            transition-all duration-150
            focus:border-[var(--color-accent)]
            focus:ring-2 focus:ring-[var(--color-accent)]/20
            disabled:opacity-50
            ${error ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20" : ""}
            ${className}
          `}
          style={{ padding: "12px 14px", fontSize: "14px" }}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-danger)]">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
