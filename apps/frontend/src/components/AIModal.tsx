import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { aiService } from "../services/ai";
import { taskService } from "../services/tasks";
import { useQueryClient } from "@tanstack/react-query";

interface AIModalProps {
  onClose: () => void;
}

export function AIModal({ onClose }: AIModalProps) {
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tasks, setTasks] = useState<{ title: string; description: string }[]>(
    [],
  );

  const handleBreakdown = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const result = await aiService.breakdownGoal(goal);
      setTasks(result);
    } catch {
      // AI not configured
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAll = async () => {
    setCreating(true);
    try {
      await Promise.all(
        tasks.map((t) => taskService.create({ ...t, status: "todo" })),
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal title="✨ AI Task Breakdown" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--color-text-secondary)">
            Describe your goal
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Build a user authentication system with JWT..."
            rows={3}
            className="w-full rounded-lg text-sm bg-(--color-surface-raised) border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none transition-all duration-150 focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20 resize-none"
            style={{ padding: "12px 14px" }}
          />
        </div>

        <Button
          onClick={handleBreakdown}
          loading={loading}
          disabled={!goal.trim()}
        >
          Break Down into Tasks
        </Button>

        {tasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-(--color-text-secondary) font-medium">
              {tasks.length} tasks generated
            </p>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-(--color-surface-raised) border border-(--color-border-subtle)"
                >
                  <p className="text-sm font-medium text-(--color-text-primary)">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-(--color-text-muted) mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleCreateAll}
              loading={creating}
              variant="primary"
            >
              Add All to Board
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
