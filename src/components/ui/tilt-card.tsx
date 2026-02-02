"use client";

import { useRef, useState, useCallback, useEffect, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMobile } from "@/hooks/use-mobile";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  tiltMaxAngle?: number;
  scale?: number;
  perspective?: number;
  transitionSpeed?: number;
  glareColor?: string;
  glareOpacity?: number;
  borderGlow?: boolean;
}

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

export function TiltCard({
  children,
  className,
  glareEnabled = true,
  tiltMaxAngle = 12,
  scale = 1.015,
  perspective = 1000,
  transitionSpeed = 350,
  glareColor = "white",
  glareOpacity = 0.12,
  borderGlow = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobile();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springConfig = { 
    stiffness: transitionSpeed, 
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  };
  
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  const scaleSpring = useSpring(1, springConfig);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => 
      `radial-gradient(circle at ${x}% ${y}%, ${glareColor} 0%, transparent 60%)`
  );

  const throttledMoveRef = useRef<((e: MouseEvent<HTMLDivElement>) => void) | null>(null);
  
  useEffect(() => {
    throttledMoveRef.current = throttleRAF((e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || prefersReducedMotion) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation based on mouse position
      const rotateXValue = (mouseY / (rect.height / 2)) * -tiltMaxAngle;
      const rotateYValue = (mouseX / (rect.width / 2)) * tiltMaxAngle;
      
      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
      
      // Calculate glare position
      const glareXValue = ((e.clientX - rect.left) / rect.width) * 100;
      const glareYValue = ((e.clientY - rect.top) / rect.height) * 100;
      
      glareX.set(glareXValue);
      glareY.set(glareYValue);
    });
  }, [rotateX, rotateY, glareX, glareY, tiltMaxAngle, prefersReducedMotion]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    throttledMoveRef.current?.(e);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsHovering(true);
    scaleSpring.set(scale);
  }, [scale, scaleSpring, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    scaleSpring.set(1);
    glareX.set(50);
    glareY.set(50);
  }, [rotateX, rotateY, scaleSpring, glareX, glareY]);

  if (isMobile || prefersReducedMotion) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl", className)}>
        <div className="relative z-10 h-full">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        borderGlow && isHovering && "shadow-lg shadow-primary/20",
        className
      )}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
        willChange: isHovering ? "transform" : "auto",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="card"
    >
      {/* Card content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: glareBackground,
            opacity: isHovering ? glareOpacity : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? glareOpacity : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Border glow effect */}
      {borderGlow && (
        <motion.div
          className="absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in oklch, var(--primary) 30%, transparent) 0%, 
              transparent 50%, 
              color-mix(in oklch, var(--primary) 20%, transparent) 100%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
}

interface FloatingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
}

export function Floating({
  children,
  className,
  duration = 4,
  distance = 10,
  delay = 0,
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
