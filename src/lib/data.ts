const FilterType = {
    // TOTAL: "total",
    ALL: "all",
    PENDING: "pending",
    ACTIVE: "active",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
};

const optionsDateFilter = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'all_time', label: 'All Time' },
];

const visibleTasksLimit = 5 ;

export { FilterType, optionsDateFilter, visibleTasksLimit };

