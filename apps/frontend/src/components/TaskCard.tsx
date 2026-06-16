import type { Task } from "@devboard/shared";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { taskService } from "../services/tasks";
import { useQueryClient } from "@tanstack/react-query";

interface TaskCardProps {
  task: Task;
  provided: DraggableProvided;
}

export function TaskCard({ task, provided }: TaskCardProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    await taskService.delete(task.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div
      ref={(ref) => provided.innerRef(ref)}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] rounded-xl cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-lg hover:shadow-black/20"
      style={{ padding: "16px 18px" }}
    >
      <div className="flex items-start justify-between" style={{ gap: "12px" }}>
        <h3
          className="font-medium text-[var(--color-text-primary)]"
          style={{ fontSize: "14px", lineHeight: "1.5", flex: 1 }}
        >
          {task.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text-muted)] hover:text-[var(--color-danger)] cursor-pointer"
        >
          ✕
        </Button>
      </div>

      {task.description && (
        <p
          className="text-[var(--color-text-muted)]"
          style={{
            fontSize: "13px",
            marginTop: "8px",
            lineHeight: "1.5",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      <div
        className="flex items-center justify-between"
        style={{ marginTop: "14px" }}
      >
        <Badge status={task.status} />
        <span
          className="text-[var(--color-text-muted)]"
          style={{ fontSize: "12px" }}
        >
          {new Date(task.createdAt).toLocaleDateString("en-FI", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
