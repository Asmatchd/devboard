import { useState } from "react";
import type { TaskStatus } from "@devboard/shared";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { taskService } from "../services/tasks";
import { aiService } from "../services/ai";
import { useQueryClient } from "@tanstack/react-query";

interface CreateTaskModalProps {
  defaultStatus: TaskStatus;
  onClose: () => void;
}

export function CreateTaskModal({
  defaultStatus,
  onClose,
}: CreateTaskModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
    try {
      const desc = await aiService.generateDescription(title);
      setDescription(desc);
    } catch {
      // AI not configured — silently skip
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await taskService.create({ title, description, status });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Task" onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
        style={{ gap: "24px" }}
      >
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="flex flex-col" style={{ gap: "8px" }}>
          <div className="flex items-center justify-between">
            <label
              className="font-medium text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={!title.trim() || aiLoading}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center"
              style={{ fontSize: "13px", gap: "4px" }}
            >
              {aiLoading ? (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "✨"
              )}
              AI Generate
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={3}
            className="w-full rounded-lg text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-150 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 resize-none"
            style={{ padding: "12px 14px" }}
          />
        </div>

        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label
            className="font-medium text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-lg text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] cursor-pointer"
            style={{ padding: "12px 14px" }}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex" style={{ gap: "12px", paddingTop: "4px" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button type="submit" loading={loading} className="flex-1">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
