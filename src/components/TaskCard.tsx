import { cn } from "@lib/utils";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CheckCircle2, Clock, Loader2, Check, Calendar, SquarePen, Trash, Save, CircleX } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import { FilterType } from "@lib/data";
import type { Itasks } from "@/types/Type.dt";
import api from "@lib/axios";
import { toast } from "sonner";
import { useState } from "react";


const TaskCard = ({ task, index, fetchTasks }: { task: Itasks; index: number; fetchTasks: () => void }) => {
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const [updatedTitle, setUpdatedTitle] = useState<string>(task.title || "");
    const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || "");

    const handleDelTask = async (ID: string) => {
        try {
            const req = await api.delete(`/api/tasks/${ID}`);
            if (req.status === 200) {
                toast.success(req.data.message || "Task deleted successfully");
                fetchTasks();
            } else {
                toast.error(req.data.message || "Failed to delete task");
            }
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const handleUpdateTask = async (ID: string) => {
        try {
            const payload: { title: string; description: string } = { title: updatedTitle, description: updatedDescription };
            const req = await api.put(`/api/tasks/${ID}`, payload);
            if (req.status === 200) {
                toast.success(req.data.message || "Task updated");
                setIsEditting(false);
                fetchTasks();
            } else {
                toast.error(req.data?.message || "Failed to update task");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update task");
        }
    };
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const handleChangeStatus = async (ID: string, status: string) => {
        setPopoverOpen(false);
        try {
            const payload: any = { status };
            const req = await api.put(`/api/tasks/${ID}`, payload);
            if (req.status === 200) {
                toast.success(req.data.message || "Status updated");
                fetchTasks();
            } else {
                toast.error(req.data?.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };
    return (
        <Card className={cn("p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group", task.status === 'completed' && 'opacity-75')} style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-4">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'ghost'}
                            size={'icon'}
                            className={cn(
                                "shrink-0 size-8 rounded-full transition-all duration-200",
                                task.status === FilterType.ACTIVE
                                    ? 'border-amber-400 text-amber-400'
                                    : task.status === FilterType.PENDING
                                        ? 'border-info text-info'
                                        : task.status === FilterType.IN_PROGRESS
                                            ? 'border-blue-400 text-blue-400'
                                            : 'border-success text-success'
                            )}
                        >
                            {task.status === FilterType.ACTIVE && <CheckCircle2 className="size-5" />}
                            {task.status === FilterType.PENDING && <Clock className="size-5" />}
                            {task.status === FilterType.IN_PROGRESS && <Loader2 className="size-5" />}
                            {task.status === FilterType.COMPLETED && <Check className="size-5" />}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-2">
                        <div className="flex flex-col gap-2">
                            <Button variant={task.status === FilterType.PENDING ? 'outline' : 'ghost'} size="sm" className="justify-start border-info text-info" onClick={() => handleChangeStatus(task._id!, FilterType.PENDING)}>
                                <Clock className="size-4 mr-2" /> Pending
                            </Button>
                            <Button variant={task.status === FilterType.ACTIVE ? 'outline' : 'ghost'} size="sm" className="justify-start border-amber-400 text-amber-400" onClick={() => handleChangeStatus(task._id!, FilterType.ACTIVE)}>
                                <CheckCircle2 className="size-4 mr-2" /> Active
                            </Button>
                            <Button variant={task.status === FilterType.IN_PROGRESS ? 'outline' : 'ghost'} size="sm" className="justify-start border-blue-400 text-blue-400" onClick={() => handleChangeStatus(task._id!, FilterType.IN_PROGRESS)}>
                                <Loader2 className="size-4 mr-2" /> In Progress
                            </Button>
                            <Button variant={task.status === FilterType.COMPLETED ? 'outline' : 'ghost'} size="sm" className="justify-start border-success text-success" onClick={() => handleChangeStatus(task._id!, FilterType.COMPLETED)}>
                                <Check className="size-4 mr-2" /> Completed
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="flex-1 min-w-0">
                    {isEditting ? (
                        <div className="flex flex-col gap-2">
                            <input
                                placeholder="Title"
                                className="w-full h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-md px-3"
                                type="text"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Description (optional)"
                                className="w-full min-h-[72px] resize-none rounded-md border border-border/50 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-primary/20"
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                            />
                            <div className="flex items-center justify-end pr-4 gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setIsEditting(false); setUpdatedTitle(task.title || ""); setUpdatedDescription(task.description || ""); }}><CircleX className="size-5" /></Button>
                                <Button variant="gradient" size="sm" onClick={() => handleUpdateTask(task._id!)}><Save className="size-5" /></Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className={cn('text-base transition-all duration-200', task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground')}>
                                {task.title}
                            </p>

                            {/* Always show description (if any) */}
                            {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                        </>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground"> - </span>
                                <Calendar className="size-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {new Date(task.completedAt).toLocaleDateString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>



                    {!isEditting && (
                        <>
                            {/* Mobile: always visible (no hover on touch) */}
                            <div className="flex gap-2 sm:hidden">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-info transition-all duration-200"
                                    onClick={() => { setIsEditting(true); setUpdatedTitle(task.title || ""); setUpdatedDescription(task.description || ""); }}
                                >
                                    <SquarePen className="size-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive transition-all duration-200"
                                    onClick={() => handleDelTask(task._id!)}
                                >
                                    <Trash className="size-5" />
                                </Button>
                            </div>

                            {/* Desktop: show on group hover */}
                            <div className="hidden gap-2 sm:group-hover:inline-flex animate-slide-up">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-info transition-all duration-200"
                                    onClick={() => { setIsEditting(true); setUpdatedTitle(task.title || ""); setUpdatedDescription(task.description || ""); }}
                                >
                                    <SquarePen className="size-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive transition-all duration-200"
                                    onClick={() => handleDelTask(task._id!)}
                                >
                                    <Trash className="size-5" />
                                </Button>
                            </div>
                        </>
                    )}
            </div>
        </Card>
    )
};

export default TaskCard;