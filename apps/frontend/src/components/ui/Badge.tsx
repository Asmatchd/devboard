import type { TaskStatus } from "@devboard/shared";

interface BadgeProps {
  status: TaskStatus;
}

const config = {
  todo: {
    label: "To Do",
    color:
      "text-[var(--color-todo)] bg-[var(--color-todo)]/10 border-[var(--color-todo)]/20",
    dot: "bg-[var(--color-todo)]",
  },
  in_progress: {
    label: "In Progress",
    color:
      "text-[var(--color-in-progress)] bg-[var(--color-in-progress)]/10 border-[var(--color-in-progress)]/20",
    dot: "bg-[var(--color-in-progress)]",
  },
  done: {
    label: "Done",
    color:
      "text-[var(--color-done)] bg-[var(--color-done)]/10 border-[var(--color-done)]/20",
    dot: "bg-[var(--color-done)]",
  },
};

export function Badge({ status }: BadgeProps) {
  const { label, color, dot } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${color}`}
      style={{ gap: "6px", padding: "4px 10px", fontSize: "12px" }}
    >
      <span
        className={`rounded-full ${dot}`}
        style={{ width: "6px", height: "6px", flexShrink: 0 }}
      />
      {label}
    </span>
  );
}
