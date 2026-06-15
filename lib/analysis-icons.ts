import {
  Scroll,
  Users,
  Sparkles,
  MapPin,
  Quote,
  Flame,
  type LucideIcon,
} from "lucide-react"

export const ANALYSIS_ICON_MAP: Record<string, LucideIcon> = {
  scroll: Scroll,
  users: Users,
  sparkles: Sparkles,
  "map-pin": MapPin,
  quote: Quote,
  flame: Flame,
}

export function getAnalysisIcon(name: string): LucideIcon {
  return ANALYSIS_ICON_MAP[name] ?? Sparkles
}
