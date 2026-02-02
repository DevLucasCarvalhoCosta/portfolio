"use client";

import { motion, MotionProps, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>;
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-1000 h-0.5 origin-left bg-primary/40",
        className
      )}
      style={{
        scaleX,
      }}
      {...props}
    />
  );
}
