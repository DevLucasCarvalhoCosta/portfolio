"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent, type RefObject } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
  magneticRadius?: number;
  as?: "button" | "a" | "div";
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.3,
  magneticRadius = 150,
  as: Component = "button",
  onClick,
  href,
  target,
  rel,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>(null);
  const isMobile = useMobile();
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring config for smooth, bouncy movement
  const springConfig = { 
    stiffness: 150, 
    damping: 15,
    mass: 0.1 
  };
  
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile || disabled) return;
    
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < magneticRadius) {
      // Apply magnetic effect
      const strength = 1 - (distance / magneticRadius);
      x.set(distanceX * magneticStrength * strength);
      y.set(distanceY * magneticStrength * strength);
    }
  }, [isMobile, disabled, magneticRadius, magneticStrength, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const MotionComponent = motion[Component] as typeof motion.button;

  const commonProps = {
    ref: buttonRef as RefObject<HTMLButtonElement>,
    className: cn(
      "relative inline-flex items-center justify-center transition-colors",
      disabled && "opacity-50 cursor-not-allowed",
      className
    ),
    style: {
      x: xSpring,
      y: ySpring,
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    whileTap: disabled ? {} : { scale: 0.95 },
    "data-magnetic": true,
  };

  if (Component === "a") {
    return (
      <motion.a
        {...commonProps}
        ref={buttonRef as RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
      >
        <MagneticContent isHovered={isHovered}>
          {children}
        </MagneticContent>
      </motion.a>
    );
  }

  if (Component === "div") {
    return (
      <motion.div
        {...commonProps}
        ref={buttonRef as RefObject<HTMLDivElement>}
      >
        <MagneticContent isHovered={isHovered}>
          {children}
        </MagneticContent>
      </motion.div>
    );
  }

  return (
    <MotionComponent
      {...commonProps}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <MagneticContent isHovered={isHovered}>
        {children}
      </MagneticContent>
    </MotionComponent>
  );
}

// Inner content with subtle scale effect
function MagneticContent({ 
  children, 
  isHovered 
}: { 
  children: ReactNode; 
  isHovered: boolean;
}) {
  return (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      {children}
    </motion.span>
  );
}

// Magnetic wrapper for existing elements
interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
}

export function MagneticWrapper({
  children,
  className,
  magneticStrength = 0.2,
}: MagneticWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  }, [isMobile, magneticStrength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={wrapperRef}
      className={className}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
