import type { ThemeName }  from "@/components/Settings/theme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeSelectorProps {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

const ThemeSelector = ({ theme, setTheme }: ThemeSelectorProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
                    Theme: {theme.replace(/_/g, " ")}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem 
                    checked={theme === "system"}
                    onCheckedChange={() => setTheme("system")}
                >
                    System
                </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem 
                    checked={theme === "Dark_Grid_with_White_Dots"}
                    onCheckedChange={() => setTheme("Dark_Grid_with_White_Dots")}
                >
                    Dark Grid with White Dots
                </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                    checked={theme === "Cosmic_Sparkle"}
                    onCheckedChange={() => setTheme("Cosmic_Sparkle")}
                >
                    Cosmic Sparkle
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                    checked={theme === "Aurora_Dream_Corner_Whispers"}
                    onCheckedChange={() => setTheme("Aurora_Dream_Corner_Whispers")}
                >
                    Aurora Dream Corner Whispers
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                    checked={theme === "Cotton_Candy_Sky"}
                    onCheckedChange={() => setTheme("Cotton_Candy_Sky")}
                >
                    Cotton Candy Sky
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                    checked={theme === "Indigo_Center_Glow"}
                    onCheckedChange={() => setTheme("Indigo_Center_Glow")}
                >
                    Indigo Center Glow
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                    checked={theme === "Purple_Corner_High"}
                    onCheckedChange={() => setTheme("Purple_Corner_High")}
                >
                    Purple Corner High
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeSelector;
