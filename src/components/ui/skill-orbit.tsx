"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import Image from "next/image";

interface Skill {
  name: string;
  icon?: string;
  iconSvg?: string;
  iconUrl?: string;
  sinceYear?: number;
  years?: number;
  proficiency?: string;
  color: string;
}

interface OrbitingSkillProps {
  skill: Skill;
  index: number;
  total: number;
  orbitRadius: number;
  duration: number;
  isPaused: boolean;
  onHover: (skill: Skill | null) => void;
  onClick: (skill: Skill) => void;
  isSelected: boolean;
  reverse?: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const DARK_ICONS = ["Next.js", "Express", "GitHub", "Prisma", "Fastify", "Cursor", "Bun"];

function getYears(skill: Skill): number {
  if (skill.years !== undefined) return skill.years;
  if (skill.sinceYear !== undefined) return CURRENT_YEAR - skill.sinceYear;
  return 0;
}

function OrbitingSkill({
  skill,
  index,
  total,
  orbitRadius,
  duration,
  isPaused,
  onHover,
  onClick,
  isSelected,
  reverse = false,
}: OrbitingSkillProps) {
  const IconComponent = skill.icon
    ? (SimpleIcons[skill.icon as keyof typeof SimpleIcons] as React.ComponentType<{ className?: string }>)
    : undefined;

  const isDark = DARK_ICONS.includes(skill.name);
  const startAngle = (index / total) * 360;
  const animationState = isPaused ? "paused" : "running";
  const animationDelay = `-${(startAngle / 360) * duration}s`;

  return (
    <div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: orbitRadius * 2,
        height: orbitRadius * 2,
        marginLeft: -orbitRadius,
        marginTop: -orbitRadius,
        animation: `orbit-${reverse ? "ccw" : "cw"} ${duration}s linear infinite`,
        animationPlayState: animationState,
        animationDelay,
      }}
    >
      <button
        type="button"
        aria-label={skill.name}
        className={cn(
          "absolute pointer-events-auto flex items-center justify-center rounded-full cursor-pointer",
          "bg-background/95 backdrop-blur-sm border-2 shadow-lg",
          "transition-all duration-200 ease-out",
          "hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isSelected && "scale-125 z-50"
        )}
        style={{
          width: 48,
          height: 48,
          left: "50%",
          top: 0,
          marginLeft: -24,
          marginTop: -24,
          borderColor: isSelected ? skill.color : `${skill.color}50`,
          boxShadow: isSelected
            ? `0 0 25px ${skill.color}50, 0 4px 15px rgba(0,0,0,0.2)`
            : "0 4px 12px rgba(0,0,0,0.1)",
          animation: `counter-orbit-${reverse ? "ccw" : "cw"} ${duration}s linear infinite`,
          animationPlayState: animationState,
          animationDelay,
          zIndex: isSelected ? 50 : "auto",
        }}
        onMouseEnter={() => onHover(skill)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(skill);
        }}
      >
        {skill.iconSvg ? (
          <span
            className="w-6 h-6 flex items-center justify-center"
            style={{ color: isDark ? "currentColor" : skill.color }}
            dangerouslySetInnerHTML={{ __html: skill.iconSvg }}
          />
        ) : skill.iconUrl ? (
          <Image
            src={skill.iconUrl}
            alt={skill.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
            unoptimized
          />
        ) : IconComponent ? (
          <span style={{ color: isDark ? "currentColor" : skill.color }}>
            <IconComponent className="w-6 h-6" />
          </span>
        ) : (
          <span className="text-xs font-bold" style={{ color: skill.color }}>
            {skill.name.slice(0, 2)}
          </span>
        )}
      </button>
    </div>
  );
}

interface SkillOrbitProps {
  title: string;
  skills: Skill[];
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  className?: string;
  index?: number;
}

export function SkillOrbit({
  title,
  skills,
  icon: CenterIcon,
  className,
  index = 0,
}: SkillOrbitProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();

  const baseOrbitRadius = isMobile ? 80 : 110;
  const orbitSpacing = isMobile ? 45 : 55;
  const skillsPerOrbit = isMobile ? 4 : 6;

  const orbits: Skill[][] = [];
  for (let i = 0; i < skills.length; i += skillsPerOrbit) {
    orbits.push(skills.slice(i, i + skillsPerOrbit));
  }

  const isPaused = !!hoveredSkill || !!selectedSkill;
  const displayedSkill = selectedSkill || hoveredSkill;
  const years = displayedSkill ? getYears(displayedSkill) : 0;
  const containerSize = baseOrbitRadius + orbits.length * orbitSpacing + 60;

  function handleContainerClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target === containerRef.current ||
      target.hasAttribute("data-orbit-ring") ||
      target.hasAttribute("data-orbit-bg")
    ) {
      setSelectedSkill(null);
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes counter-orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes counter-orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <motion.div
        ref={containerRef}
        data-orbit-bg
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: containerSize * 2, height: containerSize * 2, maxWidth: "100%" }}
        onClick={handleContainerClick}
      >
        {orbits.map((_, orbitIndex) => (
          <div
            key={orbitIndex}
            data-orbit-ring
            className="absolute rounded-full border border-primary/10 dark:border-primary/20"
            style={{
              width: (baseOrbitRadius + orbitIndex * orbitSpacing) * 2,
              height: (baseOrbitRadius + orbitIndex * orbitSpacing) * 2,
            }}
          />
        ))}

        {!prefersReducedMotion &&
          orbits.map((orbitSkills, orbitIndex) =>
            orbitSkills.map((skill, skillIndex) => (
              <OrbitingSkill
                key={skill.name}
                skill={skill}
                index={skillIndex}
                total={orbitSkills.length}
                orbitRadius={baseOrbitRadius + orbitIndex * orbitSpacing}
                duration={25 + orbitIndex * 10}
                isPaused={isPaused}
                onHover={setHoveredSkill}
                onClick={(s) => setSelectedSkill((prev) => (prev?.name === s.name ? null : s))}
                isSelected={selectedSkill?.name === skill.name}
                reverse={orbitIndex % 2 === 1}
              />
            ))
          )}

        {prefersReducedMotion && (
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-8">
            {skills.map((skill) => {
              const IconComponent = skill.icon
                ? (SimpleIcons[skill.icon as keyof typeof SimpleIcons] as React.ComponentType<{ className?: string }>)
                : undefined;
              const isDark = DARK_ICONS.includes(skill.name);

              return (
                <button
                  key={skill.name}
                  type="button"
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-background/80 border-2 transition-all",
                    selectedSkill?.name === skill.name && "ring-2 ring-primary/50 scale-110"
                  )}
                  style={{ borderColor: `${skill.color}60` }}
                  onClick={() => setSelectedSkill((prev) => (prev?.name === skill.name ? null : skill))}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {IconComponent && (
                    <span style={{ color: isDark ? "currentColor" : skill.color }}>
                      <IconComponent className="w-5 h-5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <motion.div
          className={cn(
            "relative z-10 flex flex-col items-center justify-center rounded-full",
            "bg-linear-to-br from-background via-background to-primary/5",
            "border-2 border-primary/20 shadow-xl transition-all duration-300"
          )}
          style={{ width: isMobile ? 100 : 130, height: isMobile ? 100 : 130 }}
          whileHover={{ scale: 1.05 }}
        >
          <AnimatePresence mode="wait">
            {displayedSkill ? (
              <motion.div
                key={displayedSkill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center text-center px-2"
              >
                <span className="text-sm font-bold truncate max-w-22.5" style={{ color: displayedSkill.color }}>
                  {displayedSkill.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {displayedSkill.proficiency
                    ? displayedSkill.proficiency
                    : displayedSkill.sinceYear
                      ? `desde ${displayedSkill.sinceYear}`
                      : null}
                </span>
                {years > 0 && !displayedSkill.proficiency && (
                  <span className="text-xs text-muted-foreground">
                    {years} {years === 1 ? "ano" : "anos"}
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <CenterIcon className="w-8 h-8 text-primary mb-1" />
                <span className="text-sm font-semibold text-foreground">{title}</span>
                <span className="text-xs text-muted-foreground">{skills.length} skills</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${selectedSkill.color}10 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default SkillOrbit;
