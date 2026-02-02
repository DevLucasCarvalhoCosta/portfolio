"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let maxScrollY = 0;
    let ticking = false;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // Track the maximum scroll position
      if (currentScrollY > maxScrollY) {
        maxScrollY = currentScrollY;
      }
      
      // Show button only if:
      // 1. User has scrolled down significantly (> 800px)
      // 2. User is currently scrolling up
      // 3. User has scrolled up at least 1000px from their max position
      // 4. Current position is not too close to top (> 400px)
      const hasScrolledDown = maxScrollY > 800;
      const isScrollingUp = currentScrollY < lastScrollY;
      const hasScrolledUpSignificantly = maxScrollY - currentScrollY > 1000;
      const notTooCloseToTop = currentScrollY > 400;
      
      if (hasScrolledDown && isScrollingUp && hasScrolledUpSignificantly && notTooCloseToTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    // Hide button immediately when clicked
    setIsVisible(false);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex items-center justify-center",
            "w-10 h-10 rounded-full",
            "bg-primary/70 hover:bg-primary/90",
            "text-primary-foreground",
            "shadow-md hover:shadow-lg",
            "backdrop-blur-sm",
            "transition-all duration-300",
            "hover:scale-105 active:scale-95",
            "border border-primary/10",
            "cursor-pointer"
          )}
          aria-label="Voltar ao topo"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
