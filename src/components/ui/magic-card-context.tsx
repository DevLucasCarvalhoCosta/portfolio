"use client"

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode, type RefObject } from "react"

interface MousePosition {
  x: number
  y: number
}

interface MagicCardContextType {
  mousePosition: MousePosition
  containerRef: RefObject<HTMLDivElement | null>
}

const MagicCardContext = createContext<MagicCardContextType | undefined>(undefined)

function useRAFThrottle() {
  const rafRef = useRef<number | null>(null);
  const pendingValueRef = useRef<MousePosition | null>(null);
  
  const scheduleUpdate = useCallback((value: MousePosition, setter: (value: MousePosition) => void) => {
    pendingValueRef.current = value;
    
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingValueRef.current) {
          setter(pendingValueRef.current);
        }
        rafRef.current = null;
      });
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return scheduleUpdate;
}

export function MagicCardProvider({ children }: { children: ReactNode }) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: -999, y: -999 })
  const containerRef = useRef<HTMLDivElement>(null)
  const scheduleUpdate = useRAFThrottle();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    scheduleUpdate({ x: e.clientX, y: e.clientY }, setMousePosition);
  }, [scheduleUpdate])

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
