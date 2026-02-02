"use client";

import { memo, type HTMLAttributes, type Ref } from "react";
import { motion, MotionProps, useScroll, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

interface ScrollProgressProps extends Omit<
  HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: Ref<HTMLDivElement>;
}

function ScrollProgressInner({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 35,
    restDelta: 0.001,
    restSpeed: 0.001,
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
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      {...props}
    />
  );
}

export const ScrollProgress = memo(ScrollProgressInner);
