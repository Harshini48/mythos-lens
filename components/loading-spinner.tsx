"use client"

import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer glow rings */}
        <div className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border border-primary/30 animate-ping" style={{ animationDelay: "0.5s" }} />
        </div>
        
        {/* Main spinner container */}
        <div className="relative w-24 h-24">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/50 animate-spin" style={{ animationDuration: "1.5s" }} />
          
          {/* Middle spinning ring (opposite direction) */}
          <div className="absolute inset-3 rounded-full border border-transparent border-b-primary/70 border-l-primary/30 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
          
          {/* Inner glow core */}
          <div className="absolute inset-6 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          </div>
          
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50 animate-orbit"
              style={{
                animationDelay: `${i * 0.4}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
        
        {/* Ambient glow */}
        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center">
        <p className="text-primary font-medium mb-1">Analyzing Mythological Patterns</p>
        <p className="text-sm text-muted-foreground">Mapping archetypes and symbols...</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/50 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
