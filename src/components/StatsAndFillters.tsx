import { FilterType } from "@lib/data";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";


const StatsAndFilters = (
    {
        filterType = "ALL",
        setFilter,
        NumberStatusTasks: { pendingCount = 0, activeCount = 0, inProgressCount = 0, completedCount = 0 },
    }: {
        filterType?: string;
        setFilter: (filter: string) => void;
        NumberStatusTasks: {
            pendingCount: number,
            activeCount: number,
            inProgressCount: number,
            completedCount: number
        }
    }) => {

    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            {/* phần thống kê */}
            <div className="flex gap-3">
                <Badge variant="secondary" className="bg-amber/20 text-zinc-300 border-info/20">
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {
                    Object.keys(FilterType).map((type) => (
                        <Button key={type} variant={filterType === type ? "gradient" : "ghost"} size={'sm'} className="capitalize"
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