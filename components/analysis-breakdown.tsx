"use client"

import { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisSection } from "@/lib/mythology-types"
import { getAnalysisIcon } from "@/lib/analysis-icons"

interface AnalysisBreakdownProps {
  isVisible: boolean
  sections: AnalysisSection[]
  summary: string
}

export function AnalysisBreakdown({ isVisible, sections, summary }: AnalysisBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["origin", "characters"])

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  if (!isVisible) return null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analysis Breakdown</h2>
          <p className="text-sm text-muted-foreground">Mythological deconstruction complete</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
            {sections.length} Insights
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
            High Confidence
          </span>
        </div>
      </div>

      {/* Scrolling Analysis Container */}
      <div className="flex-1 overflow-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {sections.map((section, index) => {
          const Icon = getAnalysisIcon(section.icon)
          const isExpanded = expandedSections.includes(section.id)

          return (
            <div
              key={section.id}
              className={cn(
                "rounded-xl glass-intense overflow-hidden transition-all duration-300",
                isExpanded && "shadow-lg shadow-primary/5"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    isExpanded 
                      ? "bg-primary/20 text-primary" 
                      : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-medium transition-colors",
                      isExpanded ? "text-primary" : "text-foreground"
                    )}>
                      {section.title}
                    </h3>
                    {section.highlight && (
                      <span className="text-xs text-muted-foreground">
                        {section.highlight}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {/* Expanded Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-4 pt-0">
                  <div className="relative h-px bg-border/30 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {section.content}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs bg-secondary/80 text-foreground/80 border border-border/30 hover:border-primary/30 hover:text-primary transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Summary Card */}
        <div className="rounded-xl glass-intense p-4 mt-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-primary mb-1">Analysis Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
