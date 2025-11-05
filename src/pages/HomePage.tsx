import AddTask from "@components/AddTask";
import Header from "@components/Header";
import { toast } from 'sonner';
import TaskListPagination from "@components/TaskListPagination";
import DateTimeFilter from '@components/DateTimeFillter';
import Footer from "@components/Footer";
import StatsAndFilters from "@components/StatsAndFillters";
import TaskList from "@components/TaskList";
import { useEffect, useState } from "react";
import api from "@lib/api";
import type { Itasks } from "@/types/Type.dt";

const HomePage = () => {
    const [StateBuffer, setStateBuffer] = useState<Itasks[]>([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/api/tasks");
            setStateBuffer(res.data.data as Itasks[]);
            console.log("Fetched tasks:", res.data.data as Itasks[]);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        }
    };
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
                    <AddTask />
                    <StatsAndFilters />
                    <TaskList filteredTasks={StateBuffer} />
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination />
                        <DateTimeFilter />
                    </div>
                    <Footer />

                </div>
            </div>
        </div>
    );
};
export default HomePage