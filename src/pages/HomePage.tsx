import AddTask from "@components/AddTask";
import Header from "@components/Header";
import { toast } from 'sonner';
import TaskListPagination from "@components/TaskListPagination";
import DateTimeFilter from '@components/DateTimeFillter';
import Footer from "@components/Footer";
import StatsAndFilters from "@components/StatsAndFillters";
import TaskList from "@components/TaskList";
import { useEffect, useState } from "react";
import api from "@lib/axios";
import type { Itasks } from "@/types/Type.dt";

const HomePage = () => {
    const [StateBuffer, setStateBuffer] = useState<Itasks[]>([]);
    const [NumberStatusTasks, setNumberStatusTasks] = useState<{ 
        pendingCount: number; activeCount: number; inProgressCount: number; completedCount: number 
    }>({ 
        pendingCount: 0, activeCount: 0, inProgressCount: 0, completedCount: 0 
    });
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/api/tasks");
            const TasksList = res.data.data.tasks as Itasks[];
            setNumberStatusTasks({
                pendingCount: res.data.data?.pendingCount ? res.data.data?.pendingCount : 0,
                activeCount: res.data.data?.activeCount ? res.data.data?.activeCount : 0,
                inProgressCount: res.data.data?.inProgressCount ? res.data.data?.inProgressCount : 0,
                completedCount: res.data.data?.completedCount ? res.data.data?.completedCount : 0,
            });
            setStateBuffer(TasksList);
            console.log("Fetched tasks:", TasksList);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        }
    };
    

    //filter tasks based on status
    const filterTasks = StateBuffer.filter((task) => { // dùng biến mà không dùng state trực tiếp để tránh re-render không cần thiết và biến luôn lấy lại được giá trị mới nhất
        switch (filter) {
            case 'PENDING':
                return task.status === 'pending';
            case 'ACTIVE':
                return task.status === 'active';
            case 'IN_PROGRESS':
                return task.status === 'in-progress';
            case 'COMPLETED':
                return task.status === 'completed';
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
            {/* Zigzag Lightning - Dark Pattern */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(34, 197, 94, 0.12) 20px, rgba(34, 197, 94, 0.12) 21px),
        repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(16, 185, 129, 0.10) 30px, rgba(16, 185, 129, 0.10) 31px),
        repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(59, 130, 246, 0.08) 40px, rgba(59, 130, 246, 0.08) 41px),
        repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(147, 51, 234, 0.06) 35px, rgba(147, 51, 234, 0.06) 36px)
      `,
                }}
            />
            {/* Your Content/Components */}
            <div className="container pt-8 mx-auto relative z-10">
                <div className="w-full max-w-3xlxl p-6 mx-auto space-y-6">
                    <Header />
                    <button onClick={() => toast.success("Hello world!")}>
                        Show Toast
                    </button>
                    <AddTask fetchTasks={fetchTasks} />
                    <StatsAndFilters NumberStatusTasks={NumberStatusTasks} filterType={filter} setFilter={setFilter} />
                    <TaskList filteredTasks={filterTasks} fetchTasks={fetchTasks}/>
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination />
                        <DateTimeFilter />
                    </div>
                    <Footer Pending={NumberStatusTasks.pendingCount}
                        Active={NumberStatusTasks.activeCount}
                        InProgress={NumberStatusTasks.inProgressCount}
                        Complete={NumberStatusTasks.completedCount}
                    />

                </div>
            </div>
        </div>
    );
};
export default HomePage