"use client"

import { useState } from "react"
import { Sparkles, Network, Eye, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: "deconstructor" | "characterweb"
  onViewChange: (view: "deconstructor" | "characterweb") => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    {
      id: "deconstructor" as const,
      icon: Sparkles,
      label: "Lyric Deconstructor",
      description: "Parse mythological elements",
    },
    {
      id: "characterweb" as const,
      icon: Network,
      label: "Character Web",
      description: "Map relationships",
    },
  ]

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full border-r border-border/30 bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-border/30">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              MythosLens
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              Literature Analysis
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-lg" />
              )}
              
              <div className={cn(
                "relative flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "bg-transparent text-muted-foreground group-hover:text-primary/70"
              )}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/30 blur-md rounded-lg" />
                )}
              </div>
              
              {!collapsed && (
                <div className="relative overflow-hidden text-left">
                  <span className={cn(
                    "block text-sm font-medium",
                    isActive ? "text-primary" : ""
                  )}>
                    {item.label}
                  </span>
                  <span className="block text-xs text-muted-foreground truncate">
                    {item.description}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-border/30">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary/70 transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  )
}
