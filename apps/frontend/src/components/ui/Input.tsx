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
          <label className="text-sm font-medium text-(--color-text-secondary)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg text-sm
            bg-(--color-surface-raised)
            border border-(--color-border)
            text-(--color-text-primary)
            placeholder:text-(--color-text-muted)
            outline-none
            transition-all duration-150
            focus:border-(--color-accent)
            focus:ring-2 focus:ring-(--color-accent)/20
            disabled:opacity-50
            ${error ? "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/20" : ""}
            ${className}
          `}
          style={{ padding: "12px 14px", fontSize: "14px" }}
          {...props}
        />
        {error && (
          <span className="text-xs text-(--color-danger)">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
