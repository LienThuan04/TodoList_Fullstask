import { FilterType } from "@lib/data";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";

const StatsAndFilters = (
    {
        filterType = "ALL",
        setFilter,
        NumberStatusTasks: { totalCount = 0, pendingCount = 0, activeCount = 0, inProgressCount = 0, completedCount = 0 },
    }: {
        filterType?: string;
        setFilter: (filter: string) => void;
        NumberStatusTasks: {
            totalCount: number,
            pendingCount: number,
            activeCount: number,
            inProgressCount: number,
            completedCount: number
        }
    }) => {

    const getCountForType = (type: string): number => {
        const countMap: Record<string, number> = {
            ALL: totalCount,
            PENDING: pendingCount,
            ACTIVE: activeCount,
            IN_PROGRESS: inProgressCount,
            COMPLETED: completedCount
        };
        return countMap[type] || 0;
    };

    const getStyleForType = (type: string): string => {
        const styleMap: Record<string, string> = {
            ALL: "bg-amber/20 text-zinc-200 border border-info/20",
            PENDING: "bg-amber/20 text-red-500 border border-info/20",
            ACTIVE: "bg-amber/50 text-accent-foreground border border-info/20",
            IN_PROGRESS: "bg-amber/50 text-amber-400 border border-info/20",
            COMPLETED: "bg-amber/50 text-success border border-info/20"
        };
        return styleMap[type] || "";
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Filter buttons - scroll ngang trên mobile */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
                {
                    Object.keys(FilterType).map((type) => (
                        <Button key={type} variant={filterType === type ? "gradient" : "ghost"} size={'sm'} className={`capitalize shrink-0 ${filterType === type ? "" : getStyleForType(type)}`}
                            onClick={() => setFilter(type)}
                        >
                            <Filter className="size-4" />
                            {FilterType[type as keyof typeof FilterType]} ({getCountForType(type)})
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default StatsAndFilters;