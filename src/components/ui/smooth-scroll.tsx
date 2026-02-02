"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1, 
      lerp: 0.1, 
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            lenis.scrollTo(targetElement as HTMLElement, {
              offset: -80,
              duration: 1.5,
            });
          }
        }
      }
    };

    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('getElementById')) {
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("click", handleButtonClick);

    (window as Window & { lenis?: Lenis }).lenis = lenis;

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("click", handleButtonClick);
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
