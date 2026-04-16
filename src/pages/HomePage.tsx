import AddTask from "@/components/Tasks/AddTask";
import Header from "@/layouts/Header";
import { toast } from 'sonner';
import TaskListPagination from "@/components/Tasks/TaskListPagination";
import DateTimeFilter from '@/components/Tasks/DateTimeFillter';
import Footer from "@/layouts/Footer";
import StatsAndFilters from "@/components/Tasks/StatsAndFillters";
import TaskList from "@/components/Tasks/TaskList";
import { useEffect, useState } from "react";
import api from "@lib/axios";
import type { Itasks } from "@/types/Type.dt";
import { visibleTasksLimit } from "@/lib/data";

const HomePage = () => {
    const [StateBuffer, setStateBuffer] = useState<Itasks[]>([]);
    const [NumberStatusTasks, setNumberStatusTasks] = useState<{
        totalCount: number;
        pendingCount: number; activeCount: number; inProgressCount: number; completedCount: number
    }>({
        totalCount: 0,
        pendingCount: 0, activeCount: 0, inProgressCount: 0, completedCount: 0
    });
    const [filter, setFilter] = useState<string>('ALL');
    const [dateFilterQuery, setDateFilterQuery] = useState<string>('all_time');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchTasks();
    }, [dateFilterQuery]);

    useEffect(() => {
        setCurrentPage(1); // reset to first page when filter or date changes
    }, [filter, dateFilterQuery]);

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?filterDate=${dateFilterQuery}`);
            // console.log("API response for tasks:", res.data);
            const TasksList = res?.data?.data?.tasks as Itasks[];
            setNumberStatusTasks({
                totalCount: res.data?.data?.counts?.total ? res.data?.data?.counts?.total : 0,
                pendingCount: res.data?.data?.counts?.pending ? res.data?.data?.counts?.pending : 0,
                activeCount: res?.data.data?.counts?.active ? res.data.data?.counts?.active : 0,
                inProgressCount: res.data.data?.counts?.inProgress ? res.data.data?.counts?.inProgress : 0,
                completedCount: res.data.data?.counts?.completed ? res.data.data?.counts?.completed : 0,
            });
            setStateBuffer(TasksList);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        }
    };


    //filter tasks based on status
    const filteredTasks = StateBuffer.filter((task) => { // dùng biến mà không dùng state trực tiếp để tránh re-render không cần thiết và biến luôn lấy lại được giá trị mới nhất
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

    // compute paging based on filtered tasks (important: use filtered length, not full buffer)
    const totalPages = Math.ceil(filteredTasks.length / visibleTasksLimit);

    // clamp page when filtered set changes
    useEffect(() => {
        if (totalPages === 0) {
            setCurrentPage(1);
        } else if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages]);

    const visibleTasks = filteredTasks.slice( // lấy ra các task của trang hiện tại
        (currentPage - 1) * visibleTasksLimit,
        currentPage * visibleTasksLimit
    );

    if (visibleTasks.length === 0) { // nếu trang hiện tại không có task nào thì quay về trang trước
        handlePrevPage();
    }

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
            <div className="container pt-4 sm:pt-8 mx-auto relative z-10">
                <div className="w-full max-w-3xl p-3 sm:p-6 mx-auto space-y-4 sm:space-y-6">
                    <Header />
                    <button onClick={() => toast.success("Hello world!")}>
                        Show Toast
                    </button>
                    <AddTask fetchTasks={fetchTasks} />
                    <StatsAndFilters NumberStatusTasks={NumberStatusTasks} filterType={filter} setFilter={setFilter} />
                    <TaskList filteredTasks={visibleTasks} fetchTasks={fetchTasks} />
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-6">
                        <TaskListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                        />
                        <div className="w-full sm:w-auto">
                            <DateTimeFilter dateFilterQuery={dateFilterQuery} setDateFilterQuery={setDateFilterQuery} />
                        </div>
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