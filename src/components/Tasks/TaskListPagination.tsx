import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";
import type { JSX } from "react";

const TaskListPagination = ({ currentPage, totalPages, onPageChange, onNextPage, onPrevPage }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
}) => {

    const genaratePageNumbers = (): Array<number | string> => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else{
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };


    return (
        <div className="flex justify-center mt-4">
            <Pagination>
                <PaginationContent>
                    {/* về trước */}
                    <PaginationItem>
                        <PaginationPrevious onClick={currentPage === 1 ? undefined : onPrevPage} className={cn("cursor-pointer", currentPage === 1 ? "opacity-50 cursor-not-allowed" : "")} />
                    </PaginationItem>
                    {/* đánh số trang */}
                    {genaratePageNumbers().map((page, index): JSX.Element => (
                        <PaginationItem key={index}>
                            {page === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(Number(page))}
                                    isActive={currentPage === page}
                                    className={cn("cursor-pointer", currentPage === page ? "bg-primary text-primary-foreground hover:bg-primary/80" : "")}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))
                    }                    
                    {/* về sau */}
                    <PaginationItem>
                        <PaginationNext onClick={currentPage < totalPages ? onNextPage : undefined} className={cn("cursor-pointer", currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "")} />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </div>
    );
};
export default TaskListPagination;