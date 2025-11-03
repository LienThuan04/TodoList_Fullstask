import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

const AddTask = () => {
    return (
       <div>
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input placeholder="Task title" className="flex-1 h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20" type="text" />
                <Button className="h-12 px-4" variant={'gradient'} size={'xl'} > <Plus className="size-6" /> Add Task</Button>

            </div>
        </Card>
       </div>
    );
};

export default AddTask;