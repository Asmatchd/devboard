import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@devboard/shared";
import { Layout } from "../components/Layout";
import { TaskColumn } from "../components/TaskColumn";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { AIModal } from "../components/AIModal";
import { Button } from "../components/ui/Button";
import { taskService } from "../services/tasks";
import { useAuthStore } from "../store/authStore";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function BoardPage() {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState<TaskStatus | null>(null);
  const [aiModal, setAiModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<TaskStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { token } = useAuthStore();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAll,
    enabled: !!token, // Only fetch when token exists
  });

  const getTasksByStatus = (status: TaskStatus): Task[] =>
    tasks.filter((t) => t.status === status);

  const getColumnFromOverId = (overId: string): TaskStatus | null => {
    const isColumn = COLUMNS.some((col) => col.id === overId);
    if (isColumn) return overId as TaskStatus;
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) return overTask.status;
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }
    const columnId = getColumnFromOverId(over.id as string);
    setOverColumnId(columnId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    const newStatus = overColumnId;
    setOverColumnId(null);

    if (!over || !newStatus) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isSameColumn = task.status === newStatus;
    const isOverACard = tasks.some((t) => t.id === overId);

    if (isSameColumn && isOverACard) {
      // Reorder within same column — purely visual, no API call needed
      const columnTasks = tasks.filter((t) => t.status === task.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === taskId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex === newIndex) return;

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      const otherTasks = tasks.filter((t) => t.status !== task.status);
      queryClient.setQueryData<Task[]>(
        ["tasks"],
        [...reordered, ...otherTasks],
      );
      return;
    }

    if (isSameColumn) return;

    // Move to different column
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t,
    );
    queryClient.setQueryData<Task[]>(["tasks"], updatedTasks);

    // Fire API call in background
    taskService.update(taskId, { status: newStatus }).catch(() => {
      // Rollback on failure
      queryClient.setQueryData<Task[]>(["tasks"], tasks);
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-(--color-accent) border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "40px" }}
      >
        <div>
          <h1
            className="font-bold text-(--color-text-primary)"
            style={{ fontSize: "28px" }}
          >
            Board
          </h1>
          <p
            className="text-(--color-text-secondary)"
            style={{ fontSize: "14px", marginTop: "6px" }}
          >
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center" style={{ gap: "12px" }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiModal(true)}
            className="flex items-center text-(--color-text-secondary) hover:text-(--color-text-primary) bg-(--color-surface) hover:bg-(--color-surface-raised) border border-(--color-border) rounded-lg transition-all cursor-pointer"
            style={{ padding: "8px 16px", fontSize: "14px", gap: "6px" }}
          >
            ✨ AI Breakdown
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCreateModal("todo")}
            className="flex items-center bg-(--color-accent) hover:bg-(--color-accent-hover) text-white rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
            style={{
              padding: "8px 18px",
              fontSize: "14px",
              gap: "6px",
              fontWeight: 500,
            }}
          >
            + New Task
          </Button>
        </div>
      </div>

      {/* Kanban board */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className="flex overflow-x-auto"
          style={{ gap: "24px", paddingBottom: "40px", alignItems: "stretch" }}
        >
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasksByStatus(col.id)}
              onAddTask={() => setCreateModal(col.id)}
              isOver={overColumnId === col.id}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div
              className="bg-(--color-surface) border border-(--color-accent) rounded-xl shadow-2xl opacity-90"
              style={{ padding: "16px 18px" }}
            >
              <p
                className="font-medium text-(--color-text-primary)"
                style={{ fontSize: "14px" }}
              >
                {activeTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {createModal && (
        <CreateTaskModal
          defaultStatus={createModal}
          onClose={() => setCreateModal(null)}
        />
      )}
      {aiModal && <AIModal onClose={() => setAiModal(false)} />}
    </Layout>
  );
}
