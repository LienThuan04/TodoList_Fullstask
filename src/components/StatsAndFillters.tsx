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

    return (
        <div className="flex flex-col gap-3">
            {/* phần thống kê - wrap trên mobile */}
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-amber/20  text-zinc-200 border-info/20">
                    {totalCount} Total
                </Badge>
                <Badge variant="secondary" className="bg-amber/20 text-red-500 border-info/20">
                    {pendingCount} {FilterType.PENDING}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-accent-foreground border-info/20">
                    {activeCount} {FilterType.ACTIVE}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-amber-400 border-info/20">
                    {inProgressCount} {FilterType.IN_PROGRESS}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-success border-info/20">
                    {completedCount} {FilterType.COMPLETED}
                </Badge>
            </div>
            {/* Filter buttons - scroll ngang trên mobile */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
                {
                    Object.keys(FilterType).map((type) => (
                        <Button key={type} variant={filterType === type ? "gradient" : "ghost"} size={'sm'} className="capitalize shrink-0"
                            onClick={() => setFilter(type)}
                        >
                            <Filter className="size-4" />
                            {FilterType[type as keyof typeof FilterType]}
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default StatsAndFilters;