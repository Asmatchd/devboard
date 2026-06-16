import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Task, TaskStatus } from "@devboard/shared";
import { Layout } from "../components/Layout";
import { TaskColumn } from "../components/TaskColumn";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { AIModal } from "../components/AIModal";
import { Button } from "../components/ui/Button";
import { taskService } from "../services/tasks";
import { useQueryClient } from "@tanstack/react-query";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function BoardPage() {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState<TaskStatus | null>(null);
  const [aiModal, setAiModal] = useState(false);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAll,
  });

  const getTasksByStatus = (status: TaskStatus): Task[] =>
    tasks.filter((t) => t.status === status);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newStatus = result.destination.droppableId as TaskStatus;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistic update
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      old.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await taskService.update(taskId, { status: newStatus });
    } catch {
      // Rollback on failure
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
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
            className="font-bold text-[var(--color-text-primary)]"
            style={{ fontSize: "28px" }}
          >
            Board
          </h1>
          <p
            className="text-[var(--color-text-secondary)]"
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
            className="flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-lg transition-all cursor-pointer"
            style={{ padding: "8px 16px", fontSize: "14px", gap: "6px" }}
          >
            ✨ AI Breakdown
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCreateModal("todo")}
            className="flex items-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="flex overflow-x-auto"
          style={{
            gap: "24px",
            paddingBottom: "40px",
            alignItems: "flex-start",
          }}
        >
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasksByStatus(col.id)}
              onAddTask={() => setCreateModal(col.id)}
            />
          ))}
        </div>
      </DragDropContext>

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
