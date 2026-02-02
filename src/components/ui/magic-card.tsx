"use client"

import React, { useEffect, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import { useMagicCard } from "./magic-card-context"
import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
}

export function MagicCard({
  children,
  className,
}: MagicCardProps) {
  const { mousePosition } = useMagicCard()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  useEffect(() => {
    if (cardRef.current && mousePosition.x !== -999) {
      const rect = cardRef.current.getBoundingClientRect()
      
      const relativeX = mousePosition.x - rect.left
      const relativeY = mousePosition.y - rect.top
      
      mouseX.set(relativeX)
      mouseY.set(relativeY)
    } else {
      mouseX.set(-500)
      mouseY.set(-500)
    }
  }, [mousePosition.x, mousePosition.y, mouseX, mouseY])

  return (
    <div ref={cardRef} className={cn("group relative overflow-hidden border border-primary/40 dark:border-primary/30", className)}>
      <div className="bg-background absolute inset-0 rounded-[inherit]" />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: useMotionTemplate`
            radial-gradient(600px circle at ${mouseX}px ${mouseY}px, 
            color-mix(in oklch, var(--primary) 12%, transparent), 
            transparent 70%)
          `,
          WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(1000px 600px ellipse at ${mouseX}px ${mouseY}px, 
            rgba(255, 255, 255, 0.005), 
            transparent 70%),
            radial-gradient(600px circle at ${mouseX}px ${mouseY}px, 
            rgba(255, 255, 255, 0.003), 
            transparent 90%)
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
