"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Logo } from "./logo";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import { AnimatedColorPicker } from "./animated-color-picker";
import { LanguageToggler } from "./language-toggler";

interface MobileHeaderProps {
  hidden: boolean;
  navItems: Array<{ href: string; label: string }>;
}

export function MobileHeader({ hidden, navItems }: MobileHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeKey =
    navItems.find((n) => pathname === n.href)?.href ??
    navItems[0]?.href ??
    null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const sectionId = href.replace('#', '');
    const section = document.getElementById(sectionId);

    if (section) {
      const headerOffset = 64; // Mobile header height is usually smaller (h-16 = 64px)
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: hidden ? -64 : 0, opacity: hidden ? 0.5 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="fixed top-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-primary/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70 dark:bg-card/90 dark:border-primary/30 dark:supports-backdrop-filter:bg-card/80">
        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <AnimatedColorPicker />
          <LanguageToggler />
          <AnimatedThemeToggler />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 rounded-md border border-foreground/20 dark:border-border transition-all min-w-[36px] text-foreground/70 hover:text-foreground hover:bg-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="border-b border-primary/50 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/80"
          >
            <div className="flex flex-col py-2">
              {navItems.map((item) => {
                const isActive = activeKey === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/8 text-primary dark:bg-primary/20 dark:text-primary"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    }`}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
