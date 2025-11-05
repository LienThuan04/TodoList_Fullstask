import { Card } from "@components/ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = ({ filter }: { filter: string }) => {
    return (
        <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
            <div className="space-y-3">
                <Circle className="size-12 mx-auto text-muted-foreground" />
                <div>
                    <h3 className="font-medium text-foreground">
                        {
                            filter === 'active' ? 'No active tasks available.' :
                                filter === 'pending' ? 'No pending tasks available.' :
                                    filter === 'in_progress' ? 'No tasks are currently in progress.' :
                                    filter === 'completed' ? 'No tasks have been completed yet.' :
                                            'No tasks available. Create a new task to get started!'
                        }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        { filter === 'All' ? 'You have not created any tasks yet. Start by adding a new task to manage your to-dos effectively.' : `Switch to all tasks to create new tasks. ${filter === 'Active' ? 'Has been completed' : 'Are doing'}` }
                    </p>
                </div>
            </div>
        </Card>
    )
};

export default TaskEmptyState;