import TaskEmptyState from "@components/TaskEmptyState";
import TaskCard from "@components/TaskCard";
import type { Itasks } from "@/types/Type.dt";

const TaskList = ({filteredTasks}: {filteredTasks: Itasks[]}) => {
    let filter = 'All';
    if (filteredTasks.length === 0 || !filteredTasks) {
        return <TaskEmptyState filter={filter} />;
    }
    return (
        <div className="space-y-3">
            {filteredTasks.map((task, index) => (
                <TaskCard key={task._id ?? index} task={task as Itasks} index={index} />
            ))}
        </div>
    );
};

export default TaskList;