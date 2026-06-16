import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ padding: "24px" }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl"
        style={{ maxWidth: "520px" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-[var(--color-border-subtle)]"
          style={{ padding: "24px 28px" }}
        >
          <h2
            className="font-semibold text-[var(--color-text-primary)]"
            style={{ fontSize: "17px" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            style={{ fontSize: "20px", lineHeight: 1, padding: "4px" }}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
}
