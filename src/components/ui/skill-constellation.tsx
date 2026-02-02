"use client";

import { useState, useRef, useEffect } from "react";
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

interface StarPosition {
  x: number;
  y: number;
  skill: Skill;
  size: number;
  twinkleDelay: number;
  floatDelay: number;
  floatDuration: number;
  glowDuration: number;
  twinkleRepeatDelay: number;
  connections: number[];
}

const CURRENT_YEAR = new Date().getFullYear();
const DARK_ICONS = ["Next.js", "Express", "GitHub", "Prisma", "Fastify", "Cursor", "Bun"];

function getYears(skill: Skill): number {
  if (skill.years !== undefined) return skill.years;
  if (skill.sinceYear !== undefined) return CURRENT_YEAR - skill.sinceYear;
  return 0;
}

function generateConstellationPositions(
  skills: Skill[],
  width: number,
  height: number,
  isMobile: boolean
): StarPosition[] {
  const positions: StarPosition[] = [];
  const padding = isMobile ? 40 : 60;
  const minDistance = isMobile ? 70 : 90;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  skills.forEach((skill, index) => {
    let x: number, y: number;
    let attempts = 0;

    do {
      const radius = Math.sqrt(index / skills.length) * (Math.min(width, height) / 2 - padding);
      const angle = index * goldenAngle + (Math.random() - 0.5) * 0.5;

      x = width / 2 + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
      y = height / 2 + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;
      x = Math.max(padding, Math.min(width - padding, x));
      y = Math.max(padding, Math.min(height - padding, y));
      attempts++;
    } while (
      attempts < 50 &&
      positions.some((pos) => Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2) < minDistance)
    );

    const years = getYears(skill);
    const baseSize = isMobile ? 36 : 44;

    positions.push({
      x,
      y,
      skill,
      size: baseSize + Math.min(years * 2, 16),
      twinkleDelay: Math.random() * 3,
      floatDelay: Math.random() * 2,
      floatDuration: 3 + Math.random() * 2,
      glowDuration: 2 + Math.random(),
      twinkleRepeatDelay: 3 + Math.random() * 2,
      connections: [],
    });
  });

  positions.forEach((pos, i) => {
    const nearbyStars = positions
      .map((other, j) => ({
        index: j,
        distance: Math.sqrt((pos.x - other.x) ** 2 + (pos.y - other.y) ** 2),
      }))
      .filter(({ index, distance }) => index !== i && distance < (isMobile ? 120 : 160))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    pos.connections = nearbyStars.map((s) => s.index);
  });

  return positions;
}

interface StarProps {
  position: StarPosition;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  isConnected: boolean;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
  prefersReducedMotion: boolean;
}

function Star({
  position,
  index,
  isHovered,
  isSelected,
  isConnected,
  onHover,
  onClick,
  prefersReducedMotion,
}: StarProps) {
  const { skill, size, twinkleDelay, floatDelay, floatDuration, glowDuration, twinkleRepeatDelay } = position;

  const IconComponent = skill.icon
    ? (SimpleIcons[skill.icon as keyof typeof SimpleIcons] as React.ComponentType<{ className?: string }>)
    : undefined;

  const isDark = DARK_ICONS.includes(skill.name);
  const isActive = isHovered || isSelected;
  const shouldHighlight = isActive || isConnected;

  return (
    <motion.div
      className="absolute"
      style={{ left: position.x - size / 2, top: position.y - size / 2 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: prefersReducedMotion ? 0 : [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.05 },
        scale: { duration: 0.5, delay: index * 0.05, type: "spring" },
        y: { duration: floatDuration, repeat: Infinity, delay: floatDelay, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{ backgroundColor: skill.color }}
        animate={{
          opacity: isActive ? 0.6 : prefersReducedMotion ? 0.2 : [0.15, 0.35, 0.15],
          scale: isActive ? 1.8 : 1,
        }}
        transition={{
          opacity: isActive ? { duration: 0.2 } : { duration: glowDuration, repeat: Infinity, delay: twinkleDelay },
          scale: { duration: 0.3 },
        }}
      />

      <motion.button
        className={cn(
          "relative flex items-center justify-center rounded-full cursor-pointer",
          "bg-background/90 backdrop-blur-sm border-2 shadow-lg transition-colors duration-200",
          shouldHighlight && "z-20"
        )}
        style={{
          width: size,
          height: size,
          borderColor: isActive ? skill.color : `${skill.color}50`,
          boxShadow: isActive ? `0 0 30px ${skill.color}60, 0 0 60px ${skill.color}30` : `0 0 10px ${skill.color}20`,
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.1 }}
        animate={{ scale: isConnected && !isActive ? 1.1 : 1 }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(index)}
        aria-label={skill.name}
      >
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: twinkleDelay + 1, repeatDelay: twinkleRepeatDelay }}
          />
        )}

        {skill.iconSvg ? (
          <span
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ color: isDark ? "currentColor" : skill.color }}
            dangerouslySetInnerHTML={{ __html: skill.iconSvg }}
          />
        ) : skill.iconUrl ? (
          <Image
            src={skill.iconUrl}
            alt={skill.name}
            width={24}
            height={24}
            className="w-5 h-5 md:w-6 md:h-6 object-contain"
            unoptimized
          />
        ) : IconComponent ? (
          <span style={{ color: isDark ? "currentColor" : skill.color }}>
            <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
          </span>
        ) : (
          <span className="text-xs font-bold" style={{ color: skill.color }}>
            {skill.name.slice(0, 2)}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap z-30"
          >
            <div
              className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-background/95 backdrop-blur-sm border shadow-lg"
              style={{ borderColor: `${skill.color}50` }}
            >
              <span style={{ color: skill.color }}>{skill.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ConstellationLinesProps {
  positions: StarPosition[];
  hoveredIndex: number | null;
  selectedIndex: number | null;
}

function ConstellationLines({ positions, hoveredIndex, selectedIndex }: ConstellationLinesProps) {
  const activeIndex = selectedIndex ?? hoveredIndex;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        {positions.map((pos, i) => (
          <linearGradient key={`gradient-${i}`} id={`line-gradient-${i}`}>
            <stop offset="0%" stopColor={pos.skill.color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={pos.skill.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={pos.skill.color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>

      {positions.map((pos, i) =>
        pos.connections.map((targetIndex) => {
          if (targetIndex <= i) return null;
          const target = positions[targetIndex];
          const isActive = activeIndex === i || activeIndex === targetIndex;

          return (
            <motion.line
              key={`${i}-${targetIndex}`}
              x1={pos.x}
              y1={pos.y}
              x2={target.x}
              y2={target.y}
              stroke={isActive ? pos.skill.color : `url(#line-gradient-${i})`}
              strokeWidth={isActive ? 2 : 1}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 0.8 : 0.3 }}
              transition={{ pathLength: { duration: 1, delay: i * 0.1 }, opacity: { duration: 0.3 } }}
            />
          );
        })
      )}
    </svg>
  );
}

interface SkillConstellationProps {
  title: string;
  skills: Skill[];
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  index?: number;
}

export function SkillConstellation({
  title,
  skills,
  icon: CategoryIcon,
  className,
  index = 0,
}: SkillConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 350 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<StarPosition[]>([]);
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: isMobile ? 300 : 350 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile]);

  useEffect(() => {
    setPositions(generateConstellationPositions(skills, dimensions.width, dimensions.height, isMobile));
  }, [skills, dimensions.width, dimensions.height, isMobile]);

  const activeIndex = selectedIndex ?? hoveredIndex;
  const activeSkill = activeIndex !== null ? positions[activeIndex]?.skill : null;
  const years = activeSkill ? getYears(activeSkill) : 0;

  const connectedIndices = (() => {
    if (activeIndex === null) return new Set<number>();
    const connected = new Set<number>();
    positions[activeIndex]?.connections.forEach((i) => connected.add(i));
    positions.forEach((pos, i) => {
      if (pos.connections.includes(activeIndex)) connected.add(i);
    });
    return connected;
  })();

  const backgroundStars = Array.from({ length: 20 }).map((_, i) => ({
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 23 + 11) % 100}%`,
    duration: 2 + (i % 5) * 0.5,
    delay: (i % 4) * 0.5,
  }));

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border border-primary/10 bg-linear-to-b from-background to-primary/2 overflow-hidden",
        className
      )}
      style={{ height: dimensions.height + 80 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedIndex(null);
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {!prefersReducedMotion &&
          backgroundStars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full"
              style={{ left: star.left, top: star.top }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
            />
          ))}
      </div>

      <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-primary/10">
        <div className="p-2 rounded-lg bg-primary/10">
          <CategoryIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{skills.length} tecnologias</p>
        </div>
      </div>

      <div className="relative" style={{ height: dimensions.height }}>
        <ConstellationLines positions={positions} hoveredIndex={hoveredIndex} selectedIndex={selectedIndex} />

        {positions.map((position, i) => (
          <Star
            key={position.skill.name}
            position={position}
            index={i}
            isHovered={hoveredIndex === i}
            isSelected={selectedIndex === i}
            isConnected={connectedIndices.has(i)}
            onHover={setHoveredIndex}
            onClick={(idx) => setSelectedIndex((prev) => (prev === idx ? null : idx))}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 z-30"
          >
            <div
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-md border shadow-xl"
              style={{ borderColor: `${activeSkill.color}40` }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${activeSkill.color}20` }}
              >
                {activeSkill.iconUrl ? (
                  <Image
                    src={activeSkill.iconUrl}
                    alt={activeSkill.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                    unoptimized
                  />
                ) : activeSkill.icon ? (
                  (() => {
                    const Icon = SimpleIcons[activeSkill.icon as keyof typeof SimpleIcons] as React.ComponentType<{
                      className?: string;
                    }>;
                    const isDark = DARK_ICONS.includes(activeSkill.name);
                    return Icon ? (
                      <span style={{ color: isDark ? "currentColor" : activeSkill.color }}>
                        <Icon className="w-6 h-6" />
                      </span>
                    ) : null;
                  })()
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: activeSkill.color }}>
                  {activeSkill.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeSkill.proficiency
                    ? activeSkill.proficiency
                    : activeSkill.sinceYear
                      ? `Desde ${activeSkill.sinceYear} • ${years} ${years === 1 ? "ano" : "anos"}`
                      : null}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SkillConstellation;
