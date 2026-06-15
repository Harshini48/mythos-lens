import mythologiesData from "@/data/mythologies.json"
import type { MythologiesData, MythologyRegion } from "@/lib/mythology-types"

export const mythologies = mythologiesData as MythologiesData

export function getMythologyById(id: string): MythologyRegion | undefined {
  return mythologies.find((region) => region.id === id)
}

export function getDefaultMythology(): MythologyRegion {
  return mythologies[0]
}

export function getMythologyIds(): string[] {
  return mythologies.map((region) => region.id)
}

export function applyThemeConfig(region: MythologyRegion, element: HTMLElement): void {
  const { colors, fonts } = region.themeConfig

  element.style.setProperty("--background", colors.background)
  element.style.setProperty("--foreground", colors.foreground)
  element.style.setProperty("--primary", colors.primary)
  element.style.setProperty("--accent", colors.accent)
  element.style.setProperty("--ring", colors.primary)
  element.style.setProperty("--glow-amber", colors.glow)
  element.style.setProperty("--sidebar-primary", colors.primary)
  element.style.setProperty("--sidebar-ring", colors.primary)
  element.style.setProperty("--chart-1", colors.primary)
  element.style.setProperty("--chart-2", colors.accent)

  const sansStack = `'${fonts.sans}', 'Geist', sans-serif`
  const displayStack = `'${fonts.display}', 'Geist', sans-serif`
  element.style.setProperty("--font-sans", sansStack)
  element.style.fontFamily = sansStack
  element.style.setProperty("--font-display", displayStack)
}
