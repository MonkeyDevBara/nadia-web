import {
  CalendarDays,
  Clapperboard,
  Code,
  Compass,
  LayoutTemplate,
  Layers,
  Lightbulb,
  type LucideIcon,
  MessageSquare,
  Newspaper,
  Palette,
  PenTool,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";

/** Daftar ikon yang bisa dipilih dari admin (IconPicker di Task 7 memakai map ini). */
export const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  Clapperboard,
  Code,
  Compass,
  LayoutTemplate,
  Layers,
  Lightbulb,
  MessageSquare,
  Newspaper,
  Palette,
  PenTool,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Target,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
