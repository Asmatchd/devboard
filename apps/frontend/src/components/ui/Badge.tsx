import type { TaskStatus } from "@devboard/shared";

interface BadgeProps {
  status: TaskStatus;
}

const config = {
  todo: {
    label: "To Do",
    color: "text-(--color-todo) bg-(--color-todo)/10 border-(--color-todo)/20",
    dot: "bg-(--color-todo)",
  },
  in_progress: {
    label: "In Progress",
    color:
      "text-(--color-in-progress) bg-(--color-in-progress)/10 border-(--color-in-progress)/20",
    dot: "bg-(--color-in-progress)",
  },
  done: {
    label: "Done",
    color: "text-(--color-done) bg-(--color-done)/10 border-(--color-done)/20",
    dot: "bg-(--color-done)",
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
