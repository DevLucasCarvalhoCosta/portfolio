"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variants, TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  animation?: "fadeUp" | "fadeDown" | "fadeIn" | "slideUp" | "scaleUp" | "rotateIn";
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  splitBy?: "characters" | "words" | "lines";
}

const smoothEase = [0.25, 0.4, 0.25, 1] as [number, number, number, number];

interface AnimationVariant {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
}

const animations: Record<string, AnimationVariant> = {
  fadeUp: {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: -90,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 100,
      filter: "blur(10px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
    },
  },
  scaleUp: {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      filter: "blur(4px)",
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: "blur(0px)",
    },
  },
  rotateIn: {
    hidden: { 
      opacity: 0, 
      rotateY: 90,
      x: 20,
    },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      x: 0,
    },
  },
};

export function SplitText({
  children,
  className,
  delay = 0,
  duration = 0.6,
  staggerChildren = 0.03,
  animation = "fadeUp",
  once = true,
  as: Tag = "div",
  splitBy = "characters",
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  const splitText = (text: string) => {
    if (splitBy === "words") {
      return text.split(" ").map((word, i) => ({
        text: word,
        key: `word-${i}`,
        needsSpace: i < text.split(" ").length - 1,
      }));
    }
    if (splitBy === "lines") {
      return text.split("\n").map((line, i) => ({
        text: line,
        key: `line-${i}`,
        needsSpace: false,
      }));
    }
    // Characters
    return text.split("").map((char, i) => ({
      text: char === " " ? "\u00A0" : char,
      key: `char-${i}`,
      needsSpace: false,
    }));
  };

  const parts = splitText(children);
  const animationVariants = animations[animation];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: animationVariants.hidden,
    visible: {
      ...animationVariants.visible,
      transition: {
        duration,
        ease: smoothEase,
      },
    },
  };

  return (
    <Tag ref={ref} className={cn("overflow-hidden", className)}>
      <motion.span
        className="inline-flex flex-wrap"
        style={{ perspective: "1000px" }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {parts.map((part) => (
          <span key={part.key} className="inline-block" style={{ transformStyle: "preserve-3d" }}>
            <motion.span
              className="inline-block origin-bottom"
              variants={itemVariants}
              style={{ 
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {part.text}
            </motion.span>
            {part.needsSpace && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

interface GradientSplitTextProps extends SplitTextProps {
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
}

export function GradientSplitText({
  children,
  className,
  gradientFrom = "from-primary",
  gradientTo = "to-primary/60",
  gradientVia,
  ...props
}: GradientSplitTextProps) {
  return (
    <SplitText
      className={cn(
        "bg-clip-text text-transparent bg-linear-to-r",
        gradientFrom,
        gradientVia,
        gradientTo,
        className
      )}
      {...props}
    >
      {children}
    </SplitText>
  );
}
