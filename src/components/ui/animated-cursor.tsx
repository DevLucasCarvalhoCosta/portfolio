"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  hoverType: "link" | "button" | "card" | "text" | null;
  text: string | null;
}

function throttleRAF<Args extends unknown[]>(fn: (...args: Args) => void): (...args: Args) => void {
  let rafId: number | null = null;
  let lastArgs: Args | null = null;

  return (...args: Args) => {
    lastArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) fn(...lastArgs);
        rafId = null;
      });
    }
  };
}

export function AnimatedCursor() {
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    hoverType: null,
    text: null,
  });
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4, restDelta: 0.001 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotSpringConfig = { damping: 40, stiffness: 800, mass: 0.2, restDelta: 0.001 };
  const dotXSpring = useSpring(cursorX, dotSpringConfig);
  const dotYSpring = useSpring(cursorY, dotSpringConfig);

  const handleMouseMove = useMemo(() => throttleRAF((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }), [cursorX, cursorY, isVisible]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setCursorState(prev => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursorState(prev => ({ ...prev, isClicking: false }));
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleElementHover = throttleRAF((e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const link = target.closest("a");
      const button = target.closest("button");
      const card = target.closest("[data-cursor='card']");
      const clickable = target.closest("[data-cursor='pointer']");
      const textHover = target.closest("[data-cursor='text']");

      if (link || button || clickable) {
        const text = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");
        setCursorState(prev =>
          prev.isHovering && prev.hoverType === (link ? "link" : "button") && prev.text === (text || null)
            ? prev
            : { isHovering: true, isClicking: false, hoverType: link ? "link" : "button", text: text || null }
        );
      } else if (card) {
        setCursorState(prev =>
          prev.hoverType === "card" ? prev : { isHovering: true, isClicking: false, hoverType: "card", text: null }
        );
      } else if (textHover) {
        setCursorState(prev =>
          prev.hoverType === "text" ? prev : { isHovering: true, isClicking: false, hoverType: "text", text: null }
        );
      } else {
        setCursorState(prev =>
          !prev.isHovering ? prev : { isHovering: false, isClicking: false, hoverType: null, text: null }
        );
      }
    });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleElementHover, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, prefersReducedMotion, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  if (isMobile || prefersReducedMotion) return null;

  const getCursorSize = () => {
    if (cursorState.isClicking) return 16;
    if (cursorState.hoverType === "link" || cursorState.hoverType === "button") return 64;
    if (cursorState.hoverType === "card") return 80;
    if (cursorState.hoverType === "text") return 4;
    return 32;
  };

  const cursorSize = getCursorSize();

  return (
    <>
      <motion.div
        ref={cursorRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference",
          !isVisible && "opacity-0"
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            width: cursorSize,
            height: cursorSize,
            x: -cursorSize / 2,
            y: -cursorSize / 2,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.5,
          }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-white",
              cursorState.isClicking && "bg-white"
            )}
            animate={{
              scale: cursorState.isClicking ? 0.8 : 1,
              opacity: cursorState.hoverType === "text" ? 0 : 1,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 400,
            }}
          />

          <AnimatePresence>
            {cursorState.text && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-white text-xs font-medium whitespace-nowrap"
              >
                {cursorState.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        ref={cursorDotRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999]",
          !isVisible && "opacity-0"
        )}
        style={{
          x: dotXSpring,
          y: dotYSpring,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <motion.div
          className="w-1 h-1 -ml-0.5 -mt-0.5 bg-white rounded-full mix-blend-difference"
          animate={{
            scale: cursorState.isHovering ? 0 : 1,
            opacity: cursorState.hoverType === "text" ? 1 : cursorState.isHovering ? 0 : 1,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 500,
          }}
        />
      </motion.div>
    </>
  );
}
