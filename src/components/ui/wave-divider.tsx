"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface WaveDividerProps {
  className?: string
  flip?: boolean
}

export function WaveDivider({ className, flip = false }: WaveDividerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={cn("w-full relative min-h-[100px] md:min-h-[80px] overflow-hidden leading-none", className)}
    >
      <svg
        className={cn(
          "w-full h-auto block",
          flip && "rotate-180"
        )}
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,30 C320,110 420,10 740,64 C1060,118 1080,20 1200,64 L1200,151 L0,151 Z"
          className="fill-primary/50"
          stroke="none"
        />
        
        <path
          d="M0,12 C240,80 360,0 600,48 C840,96 960,16 1200,64 L1200,151 L0,151 Z"
          className="fill-primary/60"
          stroke="none"
        />
        
        <path
          d="M0,85 C300,80 400,0 700,64 C1000,128 1100,48 1200,96 L1200,151 L0,151 Z"
          className="fill-background"
          stroke="none"
        />
      </svg>
    </motion.div>
  )
}
