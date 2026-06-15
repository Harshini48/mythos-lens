export interface ThemeConfig {
  colors: {
    primary: string
    accent: string
    background: string
    foreground: string
    glow: string
  }
  fonts: {
    sans: string
    display: string
  }
}

export interface MythologyMetadata {
  name: string
  displayName: string
  description: string
  locale: string
  tradition: string
  analysisStats: {
    archetypes: number
    references: number
    traditions: number
  }
}

export interface CharacterNode {
  id: string
  label: string
  x: number
  y: number
  type: "primary" | "secondary" | "tertiary"
  category: string
  description: string
  details: string
}

export interface CharacterConnection {
  from: string
  to: string
  strength: number
  relationship: string
}

export interface AnalysisSection {
  id: string
  title: string
  icon: string
  content: string
  tags: string[]
  highlight?: string
}

export interface Story {
  id: string
  title: string
  summary: string
  era?: string
}

export interface Song {
  id: string
  title: string
  excerpt: string
  language?: string
}

export interface Character {
  id: string
  name: string
  role: string
  description: string
}

export interface MythologyContent {
  defaultLyric: string
  exampleTexts: string[]
  stories: Story[]
  characters: Character[]
  songs: Song[]
  analysis: {
    sections: AnalysisSection[]
    summary: string
  }
  characterWeb: {
    subtitle: string
    nodes: CharacterNode[]
    connections: CharacterConnection[]
  }
  defaultCharacterWeb: {
    subtitle: string
    nodes: CharacterNode[]
    connections: CharacterConnection[]
  }
}

export interface MythologyRegion {
  id: string
  themeConfig: ThemeConfig
  metadata: MythologyMetadata
  content: MythologyContent
}

export type MythologiesData = MythologyRegion[]
