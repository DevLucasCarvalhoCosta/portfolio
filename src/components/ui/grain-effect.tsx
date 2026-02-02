"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { memo } from "react";

interface GrainEffectProps {
  className?: string;
  opacity?: number;
  blendMode?: "overlay" | "soft-light" | "multiply" | "screen";
  animated?: boolean;
}

export const GrainEffect = memo(function GrainEffect({
  className,
  opacity = 0.025,
  blendMode = "overlay",
  animated = true,
}: GrainEffectProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const shouldAnimate = animated && !prefersReducedMotion;
  
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[100]",
        shouldAnimate && "animate-grain",
        className
      )}
      style={{
        opacity,
        mixBlendMode: blendMode,
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px 150px",
      }}
      aria-hidden="true"
    />
  );
});

export function NoiseTexture({
  className,
  opacity = 0.02,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0",
        className
      )}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}
