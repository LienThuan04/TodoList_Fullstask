import AddTask from "@/components/Tasks/AddTask";
import Header from "@/layouts/Header";
import { toast } from 'sonner';
import TaskListPagination from "@/components/Tasks/TaskListPagination";
import DateTimeFilter from '@/components/Tasks/DateTimeFillter';
import Footer from "@/layouts/Footer";
import StatsAndFilters from "@/components/Tasks/StatsAndFillters";
import TaskList from "@/components/Tasks/TaskList";
import { useEffect, useState, useRef } from "react";
import api from "@lib/axios";
import type { Itasks } from "@/types/Type.dt";
import { visibleTasksLimit } from "@/lib/data";
import SearchTask from "@/components/Tasks/SearchTask";
import { getTheme, type ThemeName } from "@/components/Settings/theme";
import ThemeSelector from "@/components/Settings/ThemeSelector";

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
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [theme, setTheme] = useState<ThemeName>(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeName | null;
        return savedTheme || "system";
    });

    // Save theme to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

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

    // Debounce search query - wait 400ms after user stops typing
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);
        
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchTasks();
    }, [dateFilterQuery, debouncedSearchQuery]);

    useEffect(() => {
        setCurrentPage(1); // reset to first page when filter or date changes
    }, [filter, dateFilterQuery, debouncedSearchQuery]);

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?filterDate=${dateFilterQuery}&search=${debouncedSearchQuery}`);
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
                    backgroundImage: `${getTheme(theme)}`,
                    }}
            />
            {/* Your Content/Components */}
            <div className="container pt-4 sm:pt-8 mx-auto relative z-10">
                <div className="w-full max-w-3xl p-3 sm:p-6 mx-auto space-y-4 sm:space-y-6">
                    <Header />
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                    <AddTask fetchTasks={fetchTasks} />
                    <SearchTask searchQuery={searchQuery} onSearchChange={setSearchQuery} />
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