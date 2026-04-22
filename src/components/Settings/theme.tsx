export type ThemeName =
    | "Aurora_Dream_Corner_Whispers"
    | "Cotton_Candy_Sky"
    | "system"
    | "Dark_Grid_with_White_Dots"
    | "Cosmic_Sparkle"
    | "Indigo_Center_Glow"
    | "Purple_Corner_High"; 

export interface Theme {
    name: ThemeName;
    value: string;
}

const THEME_MAP: Record<ThemeName, string> = {
    Aurora_Dream_Corner_Whispers: `
    radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
    radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
    radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
    radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
    linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
  `,

    Cotton_Candy_Sky: `
    linear-gradient(45deg, #FFB3D9 0%, #FFD1DC 20%, #FFF0F5 40%, #E6F3FF 60%, #D1E7FF 80%, #C7E9F1 100%)
  `,

    Dark_Grid_with_White_Dots: `
    repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px)
  `,

    Cosmic_Sparkle: `
    radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)`,

    system: `
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(34, 197, 94, 0.12) 20px, rgba(34, 197, 94, 0.12) 21px),
    repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(16, 185, 129, 0.10) 30px, rgba(16, 185, 129, 0.10) 31px),
    repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(59, 130, 246, 0.08) 40px, rgba(59, 130, 246, 0.08) 41px),
    repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(147, 51, 234, 0.06) 35px, rgba(147, 51, 234, 0.06) 36px)
  `,
    Indigo_Center_Glow: `
    radial-gradient(circle at center, #6366f1, transparent)
  `,
    Purple_Corner_High: `
    radial-gradient(circle 600px at 0% 200px, #a99bf7, transparent),
    radial-gradient(circle 600px at 100% 200px, #a99bf7, transparent)
  `
};

export const getTheme = (name: ThemeName): string => {
    return THEME_MAP[name] || THEME_MAP.system;

};
