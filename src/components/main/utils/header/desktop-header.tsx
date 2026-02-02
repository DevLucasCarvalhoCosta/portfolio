"use client";

import { useState, useEffect } from "react";

import { motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Logo } from "./logo";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import { AnimatedColorPicker } from "./animated-color-picker";
import { LanguageToggler } from "./language-toggler";
import { AnimatedTabs } from "../../../ui/animated-tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DesktopHeaderProps {
  hidden: boolean;
  navItems: Array<{ href: string; label: string }>;
  activeSection: string;
  isScrollingToSectionRef: React.RefObject<boolean>;
}

export function DesktopHeader({ hidden, navItems, activeSection, isScrollingToSectionRef }: DesktopHeaderProps) {
  const t = useTranslations("header");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showColorPickerTooltip, setShowColorPickerTooltip] = useState(false);

  const activeKey = activeSection;
  const currentTab = hovered ?? selected ?? activeKey;

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenColorPickerTooltip');
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowColorPickerTooltip(true);
        
        setTimeout(() => {
          setShowColorPickerTooltip(false);
          localStorage.setItem('hasSeenColorPickerTooltip', 'true');
        }, 5000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ 
        y: hidden ? -64 : 0, 
        opacity: hidden ? 0 : 1 
      }}
      transition={{ 
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: hidden ? 0.2 : 0 }
      }}
      className="fixed top-3 left-1/2 z-50 -translate-x-1/2 px-3 pointer-events-none hidden lg:block"
    >
      <div className="pointer-events-auto flex h-14 items-center gap-4 rounded-full border border-primary/30 bg-background/80 px-5 shadow-lg backdrop-blur-xl supports-backdrop-filter:bg-background/70 dark:bg-card/80 dark:border-primary/30 dark:supports-backdrop-filter:bg-card/70">
        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        <div className="ml-1 h-6 w-px bg-foreground/20 dark:bg-border" />

        <nav className="relative flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeKey === item.href;
            const isCurrent = currentTab === item.href;
            return (
              <AnimatedTabs
                key={item.href}
                item={item}
                setHovered={setHovered}
                setSelected={setSelected}
                isActive={isActive}
                isCurrent={isCurrent}
                layoutId="tab-hover-desktop"
                isScrollingToSectionRef={isScrollingToSectionRef}
              />
            );
          })}
        </nav>

        <div className="ml-1 h-6 w-px bg-foreground/20 dark:bg-border" />
        <div className="flex items-center gap-3">
          <Tooltip open={showColorPickerTooltip} onOpenChange={setShowColorPickerTooltip}>
            <TooltipTrigger asChild>
              <div>
                <AnimatedColorPicker />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {t("tooltips.colorPicker")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <LanguageToggler />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {t("tooltips.language")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <AnimatedThemeToggler />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {t("tooltips.theme")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.header>
  );
}
