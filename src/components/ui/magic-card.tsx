"use client"

import { memo, useEffect, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { useMagicCard } from "./magic-card-context"
import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
}

// Spring config for smooth mouse following
const springConfig = {
  stiffness: 300,
  damping: 30,
  restDelta: 0.5,
  restSpeed: 0.5,
};

function MagicCardInner({
  children,
  className,
}: MagicCardProps) {
  const { mousePosition } = useMagicCard()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)
  
  // Use springs for smoother interpolation
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

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

  // Memoize the gradient templates
  const borderGradient = useMotionTemplate`
    radial-gradient(500px circle at ${smoothMouseX}px ${smoothMouseY}px, 
    color-mix(in oklch, var(--primary) 10%, transparent), 
    transparent 65%)
  `;
  
  const glowGradient = useMotionTemplate`
    radial-gradient(800px 500px ellipse at ${smoothMouseX}px ${smoothMouseY}px, 
    rgba(255, 255, 255, 0.004), 
    transparent 65%)
  `;

  return (
    <div ref={cardRef} className={cn("group relative overflow-hidden border border-primary/40 dark:border-primary/30", className)}>
      <div className="bg-background absolute inset-0 rounded-[inherit]" />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: borderGradient,
          WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
          willChange: "background",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100"
        style={{
          background: glowGradient,
          willChange: "background",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

export const MagicCard = memo(MagicCardInner);
