"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

const smoothEase = [0.25, 0.4, 0.25, 1] as [number, number, number, number];

export function SectionHeader({ title, subtitle, className, align = "left" }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { 
      scaleX: 0,
      opacity: 0,
    },
    visible: { 
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: smoothEase,
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 40,
      filter: "blur(8px)",
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: smoothEase,
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: smoothEase,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "mb-12 relative",
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
    >
      {/* Animated accent line */}
      <motion.div
        variants={lineVariants}
        className={cn(
          "h-1 w-16 bg-linear-to-r from-primary to-primary/50 rounded-full mb-6",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto",
          align === "left" && "origin-left",
          align === "center" && "origin-center",
          align === "right" && "origin-right"
        )}
      />
      
      <motion.h2 
        variants={titleVariants}
        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          variants={subtitleVariants}
          className={cn(
            "text-foreground/60 text-lg max-w-2xl",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
