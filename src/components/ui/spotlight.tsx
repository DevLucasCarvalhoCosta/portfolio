"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function throttleRAF<Args extends unknown[]>(fn: (...args: Args) => void): (...args: Args) => void {
  let rafId: number | null = null;
  
  return (...args: Args) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        fn(...args);
        rafId = null;
      });
    }
  };
}

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  spotlightSize?: number;
  spotlightColor?: string;
  spotlightOpacity?: number;
  gradientStops?: string[];
}

export function Spotlight({
  children,
  className,
  spotlightSize = 400,
  spotlightColor = "var(--primary)",
  spotlightOpacity = 0.06,
  gradientStops,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { 
    damping: 25, 
    stiffness: 180, 
    mass: 0.4,
    restDelta: 0.5,
  };
  
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  const throttledMoveRef = useRef<((e: globalThis.MouseEvent) => void) | null>(null);
  
  useEffect(() => {
    throttledMoveRef.current = throttleRAF((e: globalThis.MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
    });
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      throttledMoveRef.current?.(e);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, prefersReducedMotion, handleMouseEnter, handleMouseLeave]);

  const defaultGradient = `radial-gradient(${spotlightSize}px circle at var(--spotlight-x) var(--spotlight-y), 
    color-mix(in oklch, ${spotlightColor} ${spotlightOpacity * 100}%, transparent), 
    transparent 100%)`;

  const customGradient = gradientStops
    ? `radial-gradient(${spotlightSize}px circle at var(--spotlight-x) var(--spotlight-y), ${gradientStops.join(", ")})`
    : defaultGradient;

  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          "--spotlight-x": spotlightX as unknown as string,
          "--spotlight-y": spotlightY as unknown as string,
          background: customGradient,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.2s ease-out",
          willChange: isActive ? "transform" : "auto",
          transform: "translateZ(0)",
        } as React.CSSProperties}
      />
      
      {children}
    </div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  borderGlow?: boolean;
}

export function GlowEffect({
  children,
  className,
  glowColor = "var(--primary)",
  glowSize = 300,
  glowOpacity = 0.15,
  borderGlow = true,
}: GlowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        animate={{
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, 
            color-mix(in oklch, ${glowColor} ${glowOpacity * 100}%, transparent), 
            transparent 100%)`,
        }}
      />

      {borderGlow && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(${glowSize * 0.8}px circle at ${position.x}px ${position.y}px, 
              color-mix(in oklch, ${glowColor} 30%, transparent), 
              transparent 100%)`,
            WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface AmbientGlowProps {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  animated?: boolean;
}

export function AmbientGlow({
  className,
  color1 = "var(--primary)",
  color2,
  color3,
  animated = true,
}: AmbientGlowProps) {
  const computedColor2 = color2 || color1;
  const computedColor3 = color3 || color1;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
          top: "10%",
          left: "-10%",
        }}
        animate={animated ? {
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${computedColor2} 0%, transparent 70%)`,
          top: "50%",
          right: "-5%",
        }}
        animate={animated ? {
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        } : {}}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${computedColor3} 0%, transparent 70%)`,
          bottom: "10%",
          left: "30%",
        }}
        animate={animated ? {
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        } : {}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      />
    </div>
  );
}
