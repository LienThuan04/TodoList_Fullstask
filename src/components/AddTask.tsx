import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import api from "@lib/axios";

const AddTask = ({ fetchTasks }: { fetchTasks: () => void }) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const titleRef = useRef<HTMLInputElement | null>(null);
    const descRef = useRef<HTMLTextAreaElement | null>(null);

    const handleAdd = async () => {
        if (!title.trim()) {
            toast.error("Please provide a title for the task.");
            return;
        }
        setLoading(true);
        try {
            const payload = { title: title, description: description || undefined };
            await api.post("/tasks", payload);
            // show the task title underlined in the toast message
            toast.success(
                <span>
                    <span className="underline underline-offset-2 decoration-1 decoration-slate-400">{title}</span>
                    {` created successfully.`}
                </span>
            );
            // simple refresh so the task list picks up the new task; HomePage fetches on mount
            fetchTasks();
        } catch (err) {
            console.error("Failed to create task", err);
            toast.error("Failed to create task");
        } finally {
            setLoading(false);
            setTitle("");
            setDescription("");
        }
    };

    return (
        <div>
            <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Task title"
                            className="flex-1 h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            type="text"
                            value={title}
                            ref={titleRef}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value as string)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Tab') {
                                    // focus description immediately
                                    e.preventDefault();
                                    descRef.current?.focus();
                                } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAdd();
                                }
                            }}
                        />
                        <Button
                            className="h-12 px-4 whitespace-nowrap"
                            variant={"gradient"}
                            size={"xl"}
                            onClick={handleAdd}
                            disabled={loading || !title.trim()}
                        >
                            <Plus className="size-6" /> Add Task
                        </Button>
                    </div>

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        ref={descRef}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value as string)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            // Enter (without Shift) submits; Shift+Enter inserts newline
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                        className="w-full mt-2 min-h-[72px] resize-none rounded-md border border-border/50 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-primary/20"
                    />
                </div>
            </Card>
        </div>
    );
};

export default AddTask;