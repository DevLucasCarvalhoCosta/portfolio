import { motion, AnimatePresence } from "framer-motion";

import { LucideIcon } from "lucide-react";

import * as SimpleIcons from "@icons-pack/react-simple-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";

interface Skill {
  name: string;
  icon?: string;           // simple-icons icon name (optional)
  iconSvg?: string;        // SVG string (optional)
  iconUrl?: string;        // URL to icon image (optional)
  sinceYear?: number;      // Auto-calculate years from this year
  years?: number;          // OR hardcoded years (for skills not actively used)
  proficiency?: string;    // Language proficiency level (optional)
  color: string;
}

interface SkillCardProps {
  title: string;
  skills: Skill[];
  icon: LucideIcon;
  index: number;
}

interface SkillItemProps {
  skill: Skill;
  cardIndex: number;
  isVisible: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();

const calculateYears = (sinceYear: number): number => {
  return CURRENT_YEAR - sinceYear;
};

const getYears = (skill: Skill): number => {
  if (skill.years !== undefined) return skill.years;
  if (skill.sinceYear !== undefined) return calculateYears(skill.sinceYear);
  return 0;
};

const SkillItem = ({ skill, cardIndex, isVisible }: SkillItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const IconComponent = skill.icon
    ? SimpleIcons[skill.icon as keyof typeof SimpleIcons] as React.ComponentType<{ className?: string }> | undefined
    : undefined;
  const color = skill.color;
  const years = getYears(skill);
  const isDark = ["Next.js", "Express", "GitHub", "Prisma", "Fastify", "Cursor", "Bun"].includes(skill.name);
  const isAboveFold = cardIndex < 2;
  const shouldLazyLoad = !isAboveFold && skill.iconUrl;

  const description = skill.proficiency ? (
    skill.proficiency
  ) : skill.sinceYear ? (
    `${years} ${years === 1 ? 'ano' : 'anos'}`
  ) : skill.years ? (
    `${years} ${years === 1 ? 'ano' : 'anos'}`
  ) : null;

  const BadgeContent = (
    <>
      <div
        className="absolute inset-0 opacity-0 group-hover/badge:opacity-20 dark:group-hover/badge:opacity-15 transition-opacity duration-200 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10 flex items-center gap-3">
        {skill.iconSvg ? (
          <span
            className="shrink-0 w-5 h-5 transition-colors brightness-75 dark:brightness-100 saturate-150 dark:saturate-100"
            style={{ color: isDark ? "currentColor" : color }}
            dangerouslySetInnerHTML={{ __html: skill.iconSvg }}
          />
        ) : skill.iconUrl ? (
          <Image
            src={skill.iconUrl}
            alt={skill.name}
            width={20}
            height={20}
            className="shrink-0 w-5 h-5 object-contain"
            loading={shouldLazyLoad ? "lazy" : "eager"}
            fetchPriority={isAboveFold ? "high" : "auto"}
            unoptimized
          />
        ) : IconComponent ? (
          <span className="shrink-0 transition-colors brightness-75 dark:brightness-100 saturate-150 dark:saturate-100" style={{ color: isDark ? "currentColor" : color }}>
            <IconComponent className="w-5 h-5" />
          </span>
        ) : null}

        <span
          className={`text-base font-semibold transition-colors brightness-75 dark:brightness-100 saturate-150 dark:saturate-100 ${isDark ? "text-foreground" : ""}`}
          style={{ color: isDark ? undefined : color }}
        >
          {skill.name}
        </span>

        {isMobile && (
          <AnimatePresence mode="wait">
            {isOpen && description && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden whitespace-nowrap flex items-center will-change-[opacity,width]"
              >
                <span className="w-px h-4 bg-foreground/20 mr-3 shrink-0" />
                <span className="text-xs font-medium text-foreground/80">
                  {description}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );

  const containerStyle = {
    borderColor: `${color}50`,
    backgroundColor: `${color}20`,
    "--tech-color": color
  } as React.CSSProperties;

  const containerClass = "group/badge relative flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden hover:bg-card cursor-pointer";

  if (isMobile) {
    return (
      <div
        style={containerStyle}
        onClick={() => setIsOpen(!isOpen)}
        className={containerClass}
      >
        {BadgeContent}
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={containerStyle}
          className={`${containerClass} hover:-translate-y-0.5 transition-transform duration-200`}
        >
          {BadgeContent}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export function SkillCard({ title, skills, icon: Icon, index }: SkillCardProps) {
  const isAboveFold = index < 2;
  const [visibleSkillsCount, setVisibleSkillsCount] = useState(isAboveFold ? skills.length : 0);
  
  useEffect(() => {
    if (isAboveFold) {
      return;
    }
    
    const cardDelay = (index - 2) * 200;
    let intervalId: NodeJS.Timeout | null = null;
    
    const timer = setTimeout(() => {
      let currentCount = 0;
      intervalId = setInterval(() => {
        currentCount += 2;
        if (currentCount >= skills.length) {
          setVisibleSkillsCount(skills.length);
          if (intervalId) clearInterval(intervalId);
        } else {
          setVisibleSkillsCount(currentCount);
        }
      }, 50);
    }, cardDelay);
    
    return () => {
      clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [index, isAboveFold, skills.length]);
  
  return (
    <motion.div
      initial={{ opacity: 0.4, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isAboveFold ? 0.1 : 0.3, margin: "-100px" }}
      transition={{
        duration: 0.4,
        delay: isAboveFold ? index * 0.05 : (index - 2) * 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group relative rounded-2xl border border-primary/10 dark:border-primary/20 bg-card/80 backdrop-blur-sm p-8 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 overflow-hidden h-full flex flex-col"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/10 dark:via-primary/5 opacity-50 dark:opacity-50 group-hover:opacity-20 dark:group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10" />

      <div className="relative">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-primary/10 group-hover:border-primary/30 transition-colors relative">
          <div className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-primary/50 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-4 flex-1">
          {skills.slice(0, visibleSkillsCount).map((skill, skillIndex) => (
            <SkillItem
              key={skill.name}
              skill={skill}
              cardIndex={index}
              isVisible={skillIndex < visibleSkillsCount}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
