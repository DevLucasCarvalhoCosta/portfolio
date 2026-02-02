"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, Variants, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "center" | "none";
type RevealType = "slide" | "fade" | "scale" | "clip" | "blur";

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  type?: RevealType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  cascade?: boolean;
  cascadeDelay?: number;
}

const smoothEase = [0.25, 0.4, 0.25, 1] as [number, number, number, number];

const getVariants = (
  direction: RevealDirection,
  type: RevealType
): Variants => {
  const baseTransition: Transition = {
    duration: 0.8,
    ease: smoothEase,
  };

  // Slide animations
  if (type === "slide") {
    const offsets = {
      up: { y: 60 },
      down: { y: -60 },
      left: { x: 60 },
      right: { x: -60 },
      center: { scale: 0.9 },
      none: {},
    };

    return {
      hidden: {
        opacity: 0,
        ...offsets[direction],
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: baseTransition,
      },
    };
  }

  // Fade animations
  if (type === "fade") {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { ...baseTransition, duration: 0.6 },
      },
    };
  }

  // Scale animations
  if (type === "scale") {
    return {
      hidden: {
        opacity: 0,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: baseTransition,
      },
    };
  }

  // Blur animations
  if (type === "blur") {
    const offsets = {
      up: { y: 40 },
      down: { y: -40 },
      left: { x: 40 },
      right: { x: -40 },
      center: {},
      none: {},
    };

    return {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        ...offsets[direction],
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        y: 0,
        transition: { ...baseTransition, duration: 1 },
      },
    };
  }

  // Clip-path animations
  if (type === "clip") {
    const clipPaths = {
      up: {
        hidden: "inset(100% 0% 0% 0%)",
        visible: "inset(0% 0% 0% 0%)",
      },
      down: {
        hidden: "inset(0% 0% 100% 0%)",
        visible: "inset(0% 0% 0% 0%)",
      },
      left: {
        hidden: "inset(0% 100% 0% 0%)",
        visible: "inset(0% 0% 0% 0%)",
      },
      right: {
        hidden: "inset(0% 0% 0% 100%)",
        visible: "inset(0% 0% 0% 0%)",
      },
      center: {
        hidden: "inset(50% 50% 50% 50%)",
        visible: "inset(0% 0% 0% 0%)",
      },
      none: {
        hidden: "inset(0% 0% 0% 0%)",
        visible: "inset(0% 0% 0% 0%)",
      },
    };

    return {
      hidden: {
        clipPath: clipPaths[direction].hidden,
        opacity: 0.8,
      },
      visible: {
        clipPath: clipPaths[direction].visible,
        opacity: 1,
        transition: { ...baseTransition, duration: 1.2 },
      },
    };
  }

  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
};

export function Reveal({
  children,
  className,
  direction = "up",
  type = "slide",
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const variants = getVariants(direction, type);

  // Override duration in variants
  const customVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(variants.visible as Record<string, unknown>).transition as object,
        duration,
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for multiple reveal children
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  type?: RevealType;
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  type = "slide",
}: StaggerItemProps) {
  const variants = getVariants(direction, type);

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax effect on scroll
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transform: `translateY(var(--parallax-y, 0px))`,
      }}
      data-speed={speed}
      data-direction={direction}
    >
      {children}
    </motion.div>
  );
}

// Text line reveal animation
interface LineRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function LineReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
