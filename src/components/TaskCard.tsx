import { cn } from "@lib/utils";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CheckCircle2, Clock, Loader2, Check, Calendar, SquarePen, Trash } from "lucide-react";
import type { Itasks } from "@/types/Type.dt";

const TaskCard = ({ task, index }: { task: Itasks; index: number }) => {
    let isEditting: boolean = false;
    return (
        <Card className={cn("p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group", task.status === 'completed' && 'opacity-75')} style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-4">
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className={cn(
                        "flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        task.status === 'active'
                            ? 'border-amber-400 text-amber-400'
                            : task.status === 'pending'
                                ? 'border-info text-info'
                                : task.status === 'in-progress'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-success text-success'
                    )}
                >
                    {task.status === 'active' && <CheckCircle2 className="size-5" />}
                    {task.status === 'pending' && <Clock className="size-5" />}
                    {task.status === 'in-progress' && <Loader2 className="size-5" />}
                    {(task.status === 'completed' ) && (
                        <Check className="size-5" />
                    )}
                </Button>

                <div className="flex-1 min-w-0">
                    {isEditting ? (
                        <input placeholder="what needs to be done?" className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20" type="text" />
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



                <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-info transition-all duration-200">
                        <SquarePen className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-all duration-200">
                        <Trash className="size-5" />
                    </Button>

                </div>
            </div>
        </Card>
    )
};

export default TaskCard;