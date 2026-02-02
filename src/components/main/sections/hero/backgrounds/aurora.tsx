"use client";

import { motion } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const AuroraBackgroundInner = () => {
  const getInitialHue = () => {
    if (typeof window === "undefined") return 290;
    const inlineHue = document.documentElement.style.getPropertyValue("--theme-hue");
    if (inlineHue) {
      const parsed = parseInt(inlineHue, 10);
      if (!isNaN(parsed)) return parsed;
    }
    const cookies = document.cookie.split(";");
    const themeCookie = cookies.find((c) => c.trim().startsWith("theme-hue="));
    if (themeCookie) {
      const cookieHue = parseInt(themeCookie.split("=")[1], 10);
      if (!isNaN(cookieHue)) return cookieHue;
    }
    return 290;
  };

  const getInitialDark = () => {
    if (typeof window === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  };

  const [hue, setHue] = useState(getInitialHue);
  const [isDark, setIsDark] = useState(getInitialDark);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const observerRef = useRef<MutationObserver | null>(null);

  const updateColors = useCallback(() => {
    const html = document.documentElement;
    const htmlStyle = html.style.getPropertyValue("--theme-hue");
    const newHue = parseInt(htmlStyle || "290", 10);

    if (!isNaN(newHue)) {
      setHue(newHue);
    }
    setIsDark(html.classList.contains("dark"));
  }, []);

  useEffect(() => {
    // Defer ready state to next frame
    requestAnimationFrame(() => setIsReady(true));

    // Single observer for both style and class changes
    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "style" || mutation.attributeName === "class") {
          updateColors();
          break; // Only update once per batch
        }
      }
    });

    observerRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [updateColors]);

  // Memoize colors to prevent recalculation on every render
  const colors = useMemo(() => {
    const opacity = isDark
      ? { primary: 0.18, secondary: 0.14, tertiary: 0.10 }
      : { primary: 0.14, secondary: 0.10, tertiary: 0.07 };

    return {
      primary: `oklch(0.65 0.20 ${hue} / ${opacity.primary})`,
      secondary: `oklch(0.60 0.18 ${(hue + 60) % 360} / ${opacity.secondary})`,
      tertiary: `oklch(0.62 0.19 ${(hue - 40 + 360) % 360} / ${opacity.tertiary})`,
    };
  }, [hue, isDark]);

  // Static styles for reduced motion
  const staticAnimation = prefersReducedMotion ? { x: 0, y: 0, scale: 1 } : undefined;

  // GPU-optimized base style
  const gpuStyle = {
    willChange: "transform" as const,
    backfaceVisibility: "hidden" as const,
    transform: "translateZ(0)",
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none z-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ contain: "strict" }}
    >
      {/* Aurora Wave 1 - Primary Color - Reduced blur for performance */}
      <motion.div
        className="absolute w-[180%] h-[180%] -left-1/4 -top-1/4"
        style={{
          background: `radial-gradient(circle at center, ${colors.primary} 0%, transparent 45%)`,
          filter: "blur(50px)",
          ...gpuStyle,
        }}
        animate={staticAnimation ?? {
          x: [0, 80, 0],
          y: [0, -40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      {/* Aurora Wave 2 - Secondary Shifted Hue */}
      <motion.div
        className="absolute w-[180%] h-[180%] -right-1/4 -top-1/8"
        style={{
          background: `radial-gradient(circle at center, ${colors.secondary} 0%, transparent 45%)`,
          filter: "blur(55px)",
          ...gpuStyle,
        }}
        animate={staticAnimation ?? {
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
          delay: 2,
        }}
      />

      {/* Aurora Wave 3 - Tertiary Shifted Hue */}
      <motion.div
        className="absolute w-[160%] h-[160%] left-1/4 -bottom-1/3"
        style={{
          background: `radial-gradient(circle at center, ${colors.tertiary} 0%, transparent 45%)`,
          filter: "blur(50px)",
          ...gpuStyle,
        }}
        animate={staticAnimation ?? {
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
          delay: 4,
        }}
      />

      {/* Subtle Vignette - static, no animation needed */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 0%, rgb(0 0 0 / 0.15) 100%)"
            : "radial-gradient(ellipse at center, transparent 0%, rgb(255 255 255 / 0.25) 100%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export const AuroraBackground = memo(AuroraBackgroundInner);
