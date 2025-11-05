import { FilterType } from "@lib/data";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";

interface StatsAndFiltersProps {
    filterType?: string ;
    activeTasksCount?: number;
    pendingTasksCount?: number;
    inProgressTasksCount?: number;
    completedTasksCount?: number;
}

const StatsAndFilters = (
    {
        filterType = "All",
        activeTasksCount = 0,
        pendingTasksCount = 0,
        inProgressTasksCount = 0,
        completedTasksCount = 0,
    }: StatsAndFiltersProps) => {

    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            {/* phần thống kê */}
            <div className="flex gap-3">
                <Badge variant="secondary" className="bg-amber/20 text-zinc-300 border-info/20">
                    {pendingTasksCount} {FilterType.PENDING}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-accent-foreground border-info/20">
                    {activeTasksCount} {FilterType.ACTIVE}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-amber-400 border-info/20">
                    {inProgressTasksCount} {FilterType.IN_PROGRESS}
                </Badge>
                <Badge variant="secondary" className="bg-amber/50 text-success border-info/20">
                    {completedTasksCount} {FilterType.COMPLETED}
                </Badge>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {
                    Object.keys(FilterType).map((type) => (
                        <Button key={type} variant={filterType === type ? "gradient" : "ghost"} size={'sm'} className="capitalize">
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