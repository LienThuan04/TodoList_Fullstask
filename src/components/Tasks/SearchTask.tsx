import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchTaskProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function SearchTask({ searchQuery, onSearchChange }: SearchTaskProps) {
    return (
        <div className="w-full">
            <Label htmlFor="search-task" className="text-sm font-medium text-gray-400 mb-2 block">
                Search Tasks
            </Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                    id="search-task"
                    type="text"
                    placeholder="Search by title or description of tasks..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-10 py-2 bg-gradient-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}