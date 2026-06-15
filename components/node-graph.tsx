"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

import type { CharacterConnection, CharacterNode } from "@/lib/mythology-types"

interface NodeGraphProps {
  hasAnalysis?: boolean
  subtitle: string
  nodes: CharacterNode[]
  connections: CharacterConnection[]
  defaultNodes: CharacterNode[]
  defaultConnections: CharacterConnection[]
  defaultSubtitle: string
}

export function NodeGraph({
  hasAnalysis = false,
  subtitle,
  nodes: analysisNodes,
  connections: analysisConnections,
  defaultNodes,
  defaultConnections,
  defaultSubtitle,
}: NodeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const nodes = hasAnalysis ? analysisNodes : defaultNodes
  const connections = hasAnalysis ? analysisConnections : defaultConnections
  const graphSubtitle = hasAnalysis ? subtitle : defaultSubtitle

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Reset selected node when switching data sets
  useEffect(() => {
    setSelectedNode(null)
    setHoveredNode(null)
  }, [hasAnalysis])

  const getNodePosition = (node: CharacterNode) => ({
    x: (node.x / 100) * dimensions.width,
    y: (node.y / 100) * dimensions.height,
  })

  const getNodeSize = (type: CharacterNode["type"]) => {
    switch (type) {
      case "primary": return 24
      case "secondary": return 18
      case "tertiary": return 12
    }
  }

  const isConnectedToSelected = (nodeId: string) => {
    if (!selectedNode) return false
    return connections.some(
      (c) => (c.from === selectedNode && c.to === nodeId) || (c.to === selectedNode && c.from === nodeId)
    )
  }

  const getConnectionToSelected = (nodeId: string) => {
    if (!selectedNode) return null
    return connections.find(
      (c) => (c.from === selectedNode && c.to === nodeId) || (c.to === selectedNode && c.from === nodeId)
    )
  }

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Character Web</h2>
          <p className="text-sm text-muted-foreground">
            {graphSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
            {nodes.length} Nodes
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
            {connections.length} Links
          </span>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative flex-1 rounded-2xl glass-intense overflow-hidden"
      >
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* SVG Graph */}
        {dimensions.width > 0 && (
          <svg className="absolute inset-0 w-full h-full">
            {/* Connections */}
            <g>
              {connections.map((connection, index) => {
                const fromNode = nodes.find((n) => n.id === connection.from)
                const toNode = nodes.find((n) => n.id === connection.to)
                if (!fromNode || !toNode) return null

                const from = getNodePosition(fromNode)
                const to = getNodePosition(toNode)
                const isHighlighted = selectedNode === connection.from || selectedNode === connection.to || hoveredNode === connection.from || hoveredNode === connection.to

                return (
                  <line
                    key={index}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? "oklch(0.75 0.15 65)" : "oklch(0.3 0.05 65)"}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeOpacity={isHighlighted ? 0.8 : 0.3}
                    className="transition-all duration-300"
                  />
                )
              })}
            </g>

            {/* Node Glows */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Nodes */}
            <g>
              {nodes.map((node) => {
                const pos = getNodePosition(node)
                const size = getNodeSize(node.type)
                const isHovered = hoveredNode === node.id
                const isSelected = selectedNode === node.id
                const isConnected = isConnectedToSelected(node.id)

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    className="cursor-pointer"
                  >
                    {/* Outer glow ring for selected */}
                    {isSelected && (
                      <circle
                        r={size + 16}
                        fill="none"
                        stroke="oklch(0.75 0.15 65)"
                        strokeWidth="2"
                        strokeOpacity={0.3}
                        className="animate-pulse"
                      />
                    )}
                    
                    {/* Outer glow ring */}
                    <circle
                      r={size + 8}
                      fill="none"
                      stroke="oklch(0.75 0.15 65)"
                      strokeWidth="1"
                      strokeOpacity={isHovered || isSelected ? 0.5 : 0}
                      className="transition-all duration-300"
                    />
                    
                    {/* Main node */}
                    <circle
                      r={isHovered || isSelected ? size + 4 : size}
                      fill={
                        node.type === "primary"
                          ? "oklch(0.75 0.15 65)"
                          : node.type === "secondary"
                          ? "oklch(0.55 0.12 65)"
                          : "oklch(0.4 0.08 65)"
                      }
                      filter={isHovered || isSelected || isConnected ? "url(#glow-strong)" : undefined}
                      className={cn(
                        "transition-all duration-300",
                        (isHovered || isSelected) && "animate-node-pulse"
                      )}
                    />
                    
                    {/* Inner highlight */}
                    <circle
                      r={size * 0.4}
                      fill="oklch(0.95 0.05 65)"
                      fillOpacity={0.3}
                    />

                    {/* Label for selected/hovered nodes */}
                    {(isSelected || isHovered) && (
                      <text
                        y={-size - 12}
                        textAnchor="middle"
                        className="fill-primary text-xs font-medium pointer-events-none"
                        style={{ filter: "url(#glow)" }}
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        )}

        {/* Floating Tooltip for Selected Node */}
        {selectedNodeData && dimensions.width > 0 && (
          <div
            className="absolute z-20 w-72 transition-all duration-300 animate-fade-in"
            style={{
              left: Math.min(
                Math.max(getNodePosition(selectedNodeData).x - 144, 16),
                dimensions.width - 288 - 16
              ),
              top: Math.min(
                getNodePosition(selectedNodeData).y + 50,
                dimensions.height - 200
              ),
            }}
          >
            <div className="glass-intense rounded-xl p-4 border border-primary/30 shadow-2xl shadow-primary/20">
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedNode(null)
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                <div className="pr-6">
                  <h3 className="font-semibold text-primary">{selectedNodeData.label}</h3>
                  <span className="text-xs text-muted-foreground">{selectedNodeData.category}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-3" />

              {/* Description */}
              <p className="text-sm text-foreground/90 italic mb-2">
                {selectedNodeData.description}
              </p>

              {/* Details */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedNodeData.details}
              </p>

              {/* Connected relationships */}
              {hasAnalysis && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Connections:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {connections
                      .filter((c) => c.from === selectedNode || c.to === selectedNode)
                      .slice(0, 4)
                      .map((conn, i) => {
                        const otherNodeId = conn.from === selectedNode ? conn.to : conn.from
                        const otherNode = nodes.find((n) => n.id === otherNodeId)
                        return (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary/80 border border-primary/20"
                          >
                            {conn.relationship} {otherNode?.label}
                          </span>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Node Labels on Hover (when not selected) */}
        {hoveredNode && !selectedNode && dimensions.width > 0 && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: getNodePosition(nodes.find((n) => n.id === hoveredNode)!).x,
              top: getNodePosition(nodes.find((n) => n.id === hoveredNode)!).y - 50,
              transform: "translateX(-50%)",
            }}
          >
            <div className="px-3 py-2 rounded-lg bg-popover/95 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
              <p className="text-sm font-medium text-foreground">
                {nodes.find((n) => n.id === hoveredNode)?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {nodes.find((n) => n.id === hoveredNode)?.category}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
            <span>Secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <span>Tertiary</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          Click nodes for details
        </div>
      </div>
    </div>
  )
}
