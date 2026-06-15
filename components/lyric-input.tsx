"use client"

import { useState } from "react"
import { Send, Sparkles, BookOpen, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LyricInputProps {
  defaultLyric: string
  exampleTexts: string[]
  onSubmit?: (text: string) => void
  isLoading?: boolean
}

export function LyricInput({
  defaultLyric,
  exampleTexts,
  onSubmit,
  isLoading = false,
}: LyricInputProps) {
  const [text, setText] = useState(defaultLyric)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = () => {
    if (text.trim() && onSubmit && !isLoading) {
      onSubmit(text)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Lyric Deconstructor</h2>
            <p className="text-sm text-muted-foreground">Paste your text for mythological analysis</p>
          </div>
        </div>
      </div>

      {/* Glassmorphic Input Container */}
      <div className={cn(
        "relative flex-1 rounded-2xl transition-all duration-500",
        "glass-intense",
        isFocused && "shadow-[0_0_60px_-15px] shadow-primary/30"
      )}>
        {/* Ambient glow */}
        <div className={cn(
          "absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 rounded-2xl blur-2xl transition-opacity duration-500",
          isFocused ? "opacity-100" : "opacity-30"
        )} />
        
        <div className="relative h-full flex flex-col p-6">
          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter lyrics, verses, or mythological text to analyze..."
            disabled={isLoading}
            className={cn(
              "flex-1 w-full bg-transparent text-foreground placeholder:text-muted-foreground/50",
              "resize-none outline-none text-base leading-relaxed",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          />

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            {/* Character Count */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {text.length} characters
              </span>
              {text.length > 0 && !isLoading && (
                <button
                  onClick={() => setText("")}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 relative overflow-hidden",
                text.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mt-6">
        <p className="text-xs text-muted-foreground mb-3">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => !isLoading && setText(example)}
              disabled={isLoading}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs text-muted-foreground bg-secondary/50 border border-border/30 transition-all",
                isLoading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-secondary hover:text-foreground"
              )}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
