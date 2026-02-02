import Link from "next/link";
import { motion } from "motion/react";

interface AnimatedTabsProps {
  item: { href: string; label: string };
  setHovered: (href: string | null) => void;
  setSelected: (href: string | null) => void;
  isActive: boolean;
  isCurrent: boolean;
  layoutId?: string;
  isScrollingToSectionRef?: React.RefObject<boolean>;
}

export const AnimatedTabs = ({
  item,
  setHovered,
  setSelected,
  isActive,
  isCurrent,
  layoutId = "tab-hover",
  isScrollingToSectionRef,
}: AnimatedTabsProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelected(item.href);
    
    if (isScrollingToSectionRef) {
      isScrollingToSectionRef.current = true;
    }
    
    const sectionId = item.href.replace('#', '');
    const section = document.getElementById(sectionId);
    
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => {
        if (isScrollingToSectionRef) {
          isScrollingToSectionRef.current = false;
        }
      }, 1000);
    }
  };

  return (
    <Link
      href={item.href}
      className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-foreground/80 outline-none transition-colors hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground before:absolute before:inset-[-4px] before:rounded-lg"
      onMouseEnter={() => setHovered(item.href)}
      onMouseLeave={() => setHovered(null)}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {isCurrent && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 z-0 rounded-lg bg-primary/8 dark:bg-primary/20"
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 35,
            mass: 0.3,
          }}
        />
      )}
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
};