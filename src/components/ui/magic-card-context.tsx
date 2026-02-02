"use client"

import React, { createContext, useContext, useState, useRef, useCallback } from "react"

interface MousePosition {
  x: number
  y: number
}

interface MagicCardContextType {
  mousePosition: MousePosition
  containerRef: React.RefObject<HTMLDivElement | null>
}

const MagicCardContext = createContext<MagicCardContextType | undefined>(undefined)

export function MagicCardProvider({ children }: { children: React.ReactNode }) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: -999, y: -999 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: -999, y: -999 })
  }, [])

  return (
    <MagicCardContext.Provider value={{ mousePosition, containerRef }}>
      <div ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </MagicCardContext.Provider>
  )
}

export function useMagicCard() {
  const context = useContext(MagicCardContext)
  if (!context) {
    throw new Error("useMagicCard must be used within a MagicCardProvider")
  }
  return context
}
