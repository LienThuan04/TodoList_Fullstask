import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@lib/utils"
import { Button } from "@components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover"
import { optionsDateFilter } from "@lib/data"
import { useState } from "react"

const DateTimeFilter = ({ dateFilterQuery, setDateFilterQuery }: { dateFilterQuery: string; setDateFilterQuery: (value: string) => void }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    size={'lg'}
                    aria-expanded={open}
                >
                    {dateFilterQuery
                        ? optionsDateFilter.find((option) => option.value === dateFilterQuery)?.label
                        : "Select date filter..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No date filter found.</CommandEmpty>
                        <CommandGroup>
                            {optionsDateFilter.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        setDateFilterQuery(currentValue); // set the selected date filter
                                        setOpen(false)
                                    }}                               
                                >
                                    {option.label}
                                    
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            dateFilterQuery === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                        
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default DateTimeFilter;