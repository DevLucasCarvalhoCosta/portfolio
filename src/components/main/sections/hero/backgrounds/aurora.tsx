"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AuroraBackground = () => {
  const [hue, setHue] = useState(290);
  const [isDark, setIsDark] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const readInitialColor = () => {
      const inlineHue = document.documentElement.style.getPropertyValue("--theme-hue");
      if (inlineHue) {
        setHue(parseInt(inlineHue, 10));
        return;
      }
      
      const cookies = document.cookie.split(";");
      const themeCookie = cookies.find((c) => c.trim().startsWith("theme-hue="));
      if (themeCookie) {
        const cookieHue = parseInt(themeCookie.split("=")[1], 10);
        if (!isNaN(cookieHue)) {
          setHue(cookieHue);
        }
      }
    };

    const updateColors = () => {
      const htmlStyle = document.documentElement.style.getPropertyValue("--theme-hue");
      const newHue = parseInt(htmlStyle || "290", 10);

      if (!isNaN(newHue)) {
        setHue(newHue);
      }

      setIsDark(document.documentElement.classList.contains("dark"));
    };

    readInitialColor();
    updateColors();
    
    setTimeout(() => setIsReady(true), 0);

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate colors based on hue and theme
  // Using OKLCH for better perceptual uniformity across all hues
  // Dark mode has reduced opacity for a more subtle effect
  const opacity = isDark ? { primary: 0.2, secondary: 0.15, tertiary: 0.12 } : { primary: 0.15, secondary: 0.12, tertiary: 0.08 };
  const colors = {
    // OKLCH format: oklch(lightness chroma hue / alpha)
    // Lightness: 0.65 for balanced brightness
    // Chroma: 0.20 for vivid but not oversaturated colors
    primary: `oklch(0.65 0.20 ${hue} / ${opacity.primary})`,
    secondary: `oklch(0.60 0.18 ${(hue + 60) % 360} / ${opacity.secondary})`,
    tertiary: `oklch(0.62 0.19 ${(hue - 40 + 360) % 360} / ${opacity.tertiary})`,
  };

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Aurora Wave 1 - Primary Color */}
      <motion.div
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
        style={{
          background: `radial-gradient(circle at center, ${colors.primary} 0%, transparent 50%)`,
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Aurora Wave 2 - Secondary Shifted Hue */}
      <motion.div
        className="absolute w-[200%] h-[200%] -right-1/2 -top-1/4"
        style={{
          background: `radial-gradient(circle at center, ${colors.secondary} 0%, transparent 50%)`,
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Aurora Wave 3 - Tertiary Shifted Hue */}
      <motion.div
        className="absolute w-[180%] h-[180%] left-1/4 -bottom-1/2"
        style={{
          background: `radial-gradient(circle at center, ${colors.tertiary} 0%, transparent 50%)`,
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, -80, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Subtle Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark 
            ? "radial-gradient(ellipse at center, transparent 0%, rgb(0 0 0 / 0.2) 100%)"
            : "radial-gradient(ellipse at center, transparent 0%, rgb(255 255 255 / 0.3) 100%)",
        }}
      />
    </motion.div>
  );
};
