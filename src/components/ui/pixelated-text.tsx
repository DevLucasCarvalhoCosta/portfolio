"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelatedTextProps {
  text: string;
  className?: string;
  gridSize?: number;
  dotSize?: number;
  textOpacity?: number;
  bgOpacity?: number;
}

export function PixelatedText({
  text,
  className,
  gridSize = 8,
  dotSize = 3,
  textOpacity = 0.6,
  bgOpacity = 0.05,
}: PixelatedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth || window.innerWidth;
        const maxWidth = Math.min(containerWidth, 1400);
        const width = maxWidth;
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? 160 : 220;
        setDimensions({ width, height });
      }
    };

    const timeoutId = setTimeout(updateDimensions, 100);
    updateDimensions();
    
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = dimensions.width;
    const height = dimensions.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.margin = "0 auto";
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    const isMobile = width < 768;
    const fontSize = isMobile 
      ? Math.min(width / (text.length * 0.6), 200)
      : Math.min(width / (text.length * 0.5), 300);
    const fontFamily = "system-ui, -apple-system, sans-serif";

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.3;
    const textX = width / 2;
    const textY = isMobile ? height * 0.02 : height * 0.04;

    const tempCanvas = document.createElement("canvas");
    const scale = 3;
    const scaledTextWidth = Math.ceil(textWidth * scale);
    const scaledTextHeight = Math.ceil(textHeight * scale);
    tempCanvas.width = scaledTextWidth;
    tempCanvas.height = scaledTextHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.fillStyle = "black";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    tempCtx.font = `bold ${fontSize * scale}px ${fontFamily}`;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "top";
    tempCtx.fillStyle = "white";
    const centerX = scaledTextWidth / 2;
    const centerY = 0;
    tempCtx.fillText(text, centerX, centerY);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;

    const adjustedBgOpacity = isDark ? bgOpacity * 0.25 : bgOpacity * 0.6;
    const adjustedTextOpacity = isDark ? textOpacity * 0.6 : textOpacity * 0.8;

    let textDotsCount = 0;
    let bgDotsCount = 0;

    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        const textRelativeX = x - (textX - textWidth / 2);
        const textRelativeY = y - textY;

        let opacity = adjustedBgOpacity;

        if (
          textRelativeX >= 0 &&
          textRelativeX < textWidth &&
          textRelativeY >= 0 &&
          textRelativeY < textHeight
        ) {
          const scaledX = Math.floor(textRelativeX * scale);
          const scaledY = Math.floor(textRelativeY * scale);
          
          if (
            scaledX >= 0 && 
            scaledX < scaledTextWidth && 
            scaledY >= 0 && 
            scaledY < scaledTextHeight
          ) {
            const pixelIndex = (scaledY * scaledTextWidth + scaledX) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];

            if (r > 200 && g > 200 && b > 200 && a > 200) {
              opacity = adjustedTextOpacity;
              textDotsCount++;
            } else {
              bgDotsCount++;
            }
          } else {
            bgDotsCount++;
          }
        } else {
          bgDotsCount++;
        }

        const dotColor = isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [text, gridSize, dotSize, textOpacity, bgOpacity, dimensions, isDark]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "w-full relative flex justify-center overflow-visible",
        className
      )}
      style={{ 
        height: dimensions.height ? `${Math.ceil(dimensions.height * 0.65)}px` : "auto", 
        paddingTop: 0 
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%" }}
      />
    </motion.div>
  );
}
