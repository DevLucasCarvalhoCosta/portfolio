"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const RadialGradientBackground = () => {
  const [hue, setHue] = useState(290);
  const [isDark, setIsDark] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Read initial color from cookie or inline style
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
    
    // Defer setIsReady to avoid synchronous setState in effect
    setTimeout(() => setIsReady(true), 0);

    // Watch for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate colors based on hue and theme
  const opacity = isDark ? { primary: 0.2, secondary: 0.15 } : { primary: 0.24, secondary: 0.24 };
  const colors = {
    primary: `hsl(${hue} 70% 60% / ${opacity.primary})`,
    secondary: `hsl(${(hue + 30) % 360} 60% 55% / ${opacity.secondary})`,
  };

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Radial Spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${colors.primary} 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Glow - Moving Spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${colors.secondary} 0%, transparent 50%)`,
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark 
            ? "radial-gradient(ellipse 100% 80% at 50% 20%, transparent 0%, rgb(0 0 0 / 0.4) 100%)"
            : "radial-gradient(ellipse 100% 80% at 50% 20%, transparent 0%, rgb(255 255 255 / 0.5) 100%)",
        }}
      />
    </motion.div>
  );
};
