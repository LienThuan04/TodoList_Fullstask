import TaskEmptyState from "@/components/Tasks/TaskEmptyState";
import TaskCard from "@/components/Tasks/TaskCard";
import type { Itasks } from "@/types/Type.dt";

const TaskList = ({filteredTasks, fetchTasks}: {filteredTasks: Itasks[]; fetchTasks: () => void}) => {
    let filter = 'All';
    if (filteredTasks.length === 0 || !filteredTasks) {
        return <TaskEmptyState filter={filter} />;
    }
    return (
        <div className="space-y-3">
            {filteredTasks.map((task, index) => (
                <TaskCard key={task._id ?? index} task={task as Itasks} index={index} fetchTasks={fetchTasks} />
            ))}
        </div>
    );
};

export default TaskList;