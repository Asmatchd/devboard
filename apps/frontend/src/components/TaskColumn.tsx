import type { Task, TaskStatus } from "@devboard/shared";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/Button";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  isOver: boolean;
}

const columnStyles: Record<TaskStatus, { dot: string; count: string }> = {
  todo: {
    dot: "bg-(--color-todo)",
    count: "bg-(--color-todo)/10 text-(--color-todo)",
  },
  in_progress: {
    dot: "bg-(--color-in-progress)",
    count: "bg-(--color-in-progress)/10 text-(--color-in-progress)",
  },
  done: {
    dot: "bg-(--color-done)",
    count: "bg-(--color-done)/10 text-(--color-done)",
  },
};

export function TaskColumn({
  id,
  title,
  tasks,
  onAddTask,
  isOver,
}: TaskColumnProps) {
  const styles = columnStyles[id];
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      className="flex flex-col"
      style={{
        minWidth: "300px",
        maxWidth: "400px",
        flex: 1,
        minHeight: "calc(100vh - 220px)",
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "12px", padding: "0 4px" }}
      >
        <div className="flex items-center" style={{ gap: "8px" }}>
          <span
            className={`rounded-full ${styles.dot}`}
            style={{ width: "8px", height: "8px" }}
          />
          <span
            className="font-semibold text-(--color-text-primary)"
            style={{ fontSize: "14px" }}
          >
            {title}
          </span>
          <span
            className={`font-medium rounded-full ${styles.count}`}
            style={{ fontSize: "12px", padding: "2px 8px" }}
          >
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTask}
          className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) transition-all cursor-pointer text-lg leading-none"
        >
          +
        </Button>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className="flex flex-col rounded-xl transition-all duration-150"
        style={{
          gap: "8px",
          flex: 1,
          padding: "8px",
          background: isOver
            ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
            : "color-mix(in srgb, var(--color-surface-raised) 50%, transparent)",
          border: isOver
            ? "1px dashed var(--color-accent)"
            : "1px solid transparent",
          boxShadow: isOver
            ? "inset 0 0 0 2px color-mix(in srgb, var(--color-accent) 20%, transparent)"
            : "none",
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div
            className="flex items-center justify-center"
            style={{ padding: "32px 0" }}
          >
            <p
              className="text-(--color-text-muted)"
              style={{ fontSize: "13px" }}
            >
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
