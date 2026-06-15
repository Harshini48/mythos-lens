"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import mythologiesData from "@/data/mythologies.json"
import type { MythologiesData, MythologyRegion } from "@/lib/mythology-types"
import { applyThemeConfig } from "@/lib/mythologies"
import { Sidebar } from "@/components/sidebar"
import { LyricInput } from "@/components/lyric-input"
import { NodeGraph } from "@/components/node-graph"
import { AnalysisBreakdown } from "@/components/analysis-breakdown"
import { LoadingSpinner } from "@/components/loading-spinner"

const mythologies = mythologiesData as MythologiesData

export default function MythosLensDashboard() {
  const [activeRegion, setActiveRegion] = useState<MythologyRegion>(mythologies[0])
  const [activeView, setActiveView] = useState<"deconstructor" | "characterweb">("deconstructor")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [analysisStats, setAnalysisStats] = useState({
    archetypes: 0,
    references: 0,
    traditions: 0,
    lastAnalysis: "Never",
  })

  const themeRef = useRef<HTMLDivElement>(null)
  const { content, metadata, themeConfig } = activeRegion

  useEffect(() => {
    if (themeRef.current) {
      applyThemeConfig(activeRegion, themeRef.current)
    }
  }, [activeRegion])

  const handleRegionChange = useCallback((regionId: string) => {
    const nextRegion = mythologies.find((m) => m.id === regionId)
    if (!nextRegion) return

    setActiveRegion(nextRegion)
    setHasAnalysis(false)
    setIsAnalyzing(false)
    setAnalysisStats({
      archetypes: 0,
      references: 0,
      traditions: 0,
      lastAnalysis: "Never",
    })
  }, [])

  const handleTextSubmit = useCallback((_text: string) => {
    setIsAnalyzing(true)
    setHasAnalysis(false)

    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalysis(true)
      setAnalysisStats({
        archetypes: metadata.analysisStats.archetypes,
        references: metadata.analysisStats.references,
        traditions: metadata.analysisStats.traditions,
        lastAnalysis: "Just now",
      })
    }, 2000)
  }, [metadata.analysisStats])

  const handleViewChange = useCallback((view: "deconstructor" | "characterweb") => {
    setActiveView(view)
  }, [])

  return (
    <div ref={themeRef} className="flex h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Sidebar activeView={activeView} onViewChange={handleViewChange} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border/30 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAnalyzing ? "bg-primary animate-pulse" : "bg-green-500"}`} />
              <span className="text-sm text-muted-foreground">
                {isAnalyzing ? "Analyzing..." : "System Active"}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {metadata.tradition} · {themeConfig.fonts.display}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={activeRegion.id}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="text-xs text-foreground px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            >
              {mythologies.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.metadata.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-secondary/50 border border-border/30">
              {hasAnalysis ? `Regional: ${metadata.displayName}` : "Regional: All Mythologies"}
            </span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 p-6 border-r border-border/30 overflow-auto flex flex-col gap-6">
            <LyricInput
              key={activeRegion.id}
              defaultLyric={content.defaultLyric}
              exampleTexts={content.exampleTexts}
              onSubmit={handleTextSubmit}
              isLoading={isAnalyzing}
            />

            <div className="rounded-xl glass-intense p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground">{metadata.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{metadata.description}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Stories</p>
                <div className="space-y-2">
                  {content.stories.map((story) => (
                    <div key={story.id} className="rounded-lg bg-secondary/40 px-3 py-2 border border-border/20">
                      <p className="text-xs font-medium text-foreground">{story.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{story.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Characters</p>
                <div className="flex flex-wrap gap-2">
                  {content.characters.map((character) => (
                    <span
                      key={character.id}
                      className="px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
                      title={character.description}
                    >
                      {character.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Songs</p>
                <div className="space-y-2">
                  {content.songs.map((song) => (
                    <div key={song.id} className="rounded-lg bg-secondary/40 px-3 py-2 border border-border/20">
                      <p className="text-xs font-medium text-foreground">{song.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 italic line-clamp-2">{song.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-6 overflow-auto">
            {isAnalyzing ? (
              <LoadingSpinner />
            ) : activeView === "deconstructor" ? (
              <AnalysisBreakdown
                isVisible={hasAnalysis}
                sections={content.analysis.sections}
                summary={content.analysis.summary}
              />
            ) : (
              <NodeGraph
                hasAnalysis={hasAnalysis}
                subtitle={content.characterWeb.subtitle}
                nodes={content.characterWeb.nodes}
                connections={content.characterWeb.connections}
                defaultNodes={content.defaultCharacterWeb.nodes}
                defaultConnections={content.defaultCharacterWeb.connections}
                defaultSubtitle={content.defaultCharacterWeb.subtitle}
              />
            )}

            {!isAnalyzing && activeView === "deconstructor" && !hasAnalysis && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-primary/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Awaiting Text Input
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste lyrics, verses, or mythological text on the left panel and click Analyze to reveal hidden patterns in {metadata.name}.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="h-12 border-t border-border/30 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">{analysisStats.archetypes}</span>
              <span>Archetypes Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">{analysisStats.references}</span>
              <span>Mythological References</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">{analysisStats.traditions}</span>
              <span>Regional Traditions</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last analysis:</span>
            <span className="text-primary">{analysisStats.lastAnalysis}</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
