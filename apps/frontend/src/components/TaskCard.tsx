import { useState } from "react";
import type { Task } from "@devboard/shared";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { taskService } from "../services/tasks";
import { useQueryClient } from "@tanstack/react-query";
import { EditTaskModal } from "./EditTaskModal";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: "16px 18px",
  };

  const handleDelete = async () => {
    await taskService.delete(task.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group bg-(--color-surface) border border-(--color-border-subtle) hover:border-(--color-border) rounded-xl cursor-grab active:cursor-grabbing transition-colors duration-150 hover:shadow-lg hover:shadow-black/20"
      >
        <div
          className="flex items-start justify-between"
          style={{ gap: "12px" }}
        >
          <h3
            className="font-medium text-(--color-text-primary)"
            style={{ fontSize: "14px", lineHeight: "1.5", flex: 1 }}
          >
            {task.title}
          </h3>

          <div
            className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ gap: "4px" }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="text-(--color-text-muted) hover:text-(--color-accent)"
              title="Edit task"
            >
              ✏️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-(--color-text-muted) hover:text-(--color-danger)"
              title="Delete task"
            >
              ✕
            </Button>
          </div>
        </div>

        {task.description && (
          <p
            className="text-(--color-text-muted)"
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
            className="text-(--color-text-muted)"
            style={{ fontSize: "12px" }}
          >
            {new Date(task.createdAt).toLocaleDateString("en-FI", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      {editing && (
        <EditTaskModal task={task} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
