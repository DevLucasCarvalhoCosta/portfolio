"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ColorPickerProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
}

const COLOR_PRESETS = [
  { name: "Purple", hue: 290, label: "💜" },
  { name: "Blue", hue: 220, label: "💙" },
  { name: "Teal", hue: 180, label: "🩵" },
  { name: "Green", hue: 150, label: "💚" },
  { name: "Lime", hue: 100, label: "💚" },
  { name: "Yellow", hue: 60, label: "💛" },
  { name: "Amber", hue: 40, label: "🧡" },
  { name: "Orange", hue: 20, label: "🧡" },
  { name: "Red", hue: 0, label: "❤️" },
  { name: "Pink", hue: 330, label: "💗" },
];

export const AnimatedColorPicker = ({
  className,
  ...props
}: ColorPickerProps) => {
  const t = useTranslations("colorPicker");
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [currentHue, setCurrentHue] = useState(() => {
    if (typeof window !== "undefined") {
      // Lê o cookie theme-hue
      const cookies = document.cookie.split("; ");
      const hueCookie = cookies.find(c => c.startsWith("theme-hue="));
      if (hueCookie) {
        const savedHue = hueCookie.split("=")[1];
        return parseInt(savedHue, 10);
      }
    }
    return 290;
  });

  const applyColorToTheme = (hue: number) => {
    const root = document.documentElement;
    // Apenas atualiza o hue, as outras cores são calculadas via CSS variáveis no globals.css
    root.style.setProperty("--theme-hue", hue.toString());
    
    // Salva no cookie (válido por 1 ano)
    document.cookie = `theme-hue=${hue}; path=/; max-age=31536000; SameSite=Lax`;
  };

  useEffect(() => {
    applyColorToTheme(currentHue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const handleColorSelect = (hue: number) => {
    setCurrentHue(hue);
    applyColorToTheme(hue);
  };

  const modalContent = isOpen && buttonRect ? (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
        onClick={() => setIsOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed z-[101] overflow-visible"
        style={{
          left: `${buttonRect.left + buttonRect.width / 2}px`,
          top: `${buttonRect.bottom + 12}px`,
        }}
      >
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-l border-t border-border"
          style={{ zIndex: -1 }}
        />
        
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {t("title")}
                </h3>
                <p className="text-xs text-foreground/50 mt-0.5">
                  {t("subtitle")}
                </p>
              </div>
              <div 
                className="w-6 h-6 rounded-full"
                style={{
                  background: `oklch(0.65 0.20 ${currentHue})`,
                  boxShadow: `0 0 20px oklch(0.65 0.20 ${currentHue} / 0.3)`,
                }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3 min-w-[240px]">
              {COLOR_PRESETS.map((color) => {
                const isSelected = currentHue === color.hue;
                return (
                  <motion.button
                    key={color.hue}
                    onClick={() => handleColorSelect(color.hue)}
                    className={cn(
                      "relative flex items-center justify-center p-4 rounded-xl transition-all group",
                      "hover:scale-105 active:scale-95",
                      isSelected
                        ? "bg-primary/10 shadow-lg"
                        : "hover:bg-accent/30"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="selected-color-bg"
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      />
                    )}
                    
                    <div className="relative">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full shadow-lg transition-all",
                          "ring-2 ring-background",
                          isSelected && "ring-primary"
                        )}
                        style={{
                          background: `oklch(0.65 0.20 ${color.hue})`,
                          boxShadow: isSelected 
                            ? `0 8px 20px oklch(0.65 0.20 ${color.hue} / 0.4)`
                            : `0 4px 12px oklch(0.65 0.20 ${color.hue} / 0.2)`,
                        }}
                      />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="var(--primary-foreground)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center p-2 rounded-md border transition-all min-w-[36px]",
          "border-foreground/20 dark:border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
          className
        )}
        aria-label={t("ariaLabel")}
        {...props}
      >
        <Palette size={16} />
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>{modalContent}</AnimatePresence>,
          document.body
        )}
    </>
  );
};
