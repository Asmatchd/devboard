import type { Task, TaskStatus } from "@devboard/shared";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/Button";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
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

export function TaskColumn({ id, title, tasks, onAddTask }: TaskColumnProps) {
  const styles = columnStyles[id];

  return (
    <div
      className="flex flex-col flex-1"
      style={{ minWidth: "300px", maxWidth: "400px" }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <span className="text-sm font-semibold text-(--color-text-primary)">
            {title}
          </span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${styles.count}`}
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
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-[200px] p-2 rounded-xl transition-colors duration-150 ${
              snapshot.isDraggingOver
                ? "bg-(--color-accent)/5 border border-dashed border-(--color-accent)/30"
                : "bg-(--color-surface-raised)/50 border border-transparent"
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => <TaskCard task={task} provided={provided} />}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="text-xs text-(--color-text-muted)">
                  No tasks yet
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
