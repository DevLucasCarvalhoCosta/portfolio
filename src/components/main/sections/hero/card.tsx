"use client";

import { motion } from "motion/react";
import { MapPin, Coffee, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { SiTypescript, SiReact, SiNodedotjs, SiPostgresql } from "@icons-pack/react-simple-icons";
import { useEffect, useState } from "react";

const MorphingText = dynamic(() => import("@/components/ui/morphing-text").then((mod) => mod.MorphingText), {
  ssr: false,
});

interface HeroCardProps {
  adjectives: string[];
}

export const HeroCard = ({ adjectives }: HeroCardProps) => {
  const t = useTranslations("hero");
  const [visitorCount, setVisitorCount] = useState<number>(0);

  const yearStarted = 2021;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - yearStarted;

  const birthDate = new Date(1996, 3, 15);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('/api/visits', {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error('Failed to track visit:', error);
        try {
          const response = await fetch('/api/visits');
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count);
          }
        } catch (fallbackError) {
          console.error('Failed to get visitor count:', fallbackError);
        }
      }
    };

    trackVisit();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative hidden lg:flex items-start justify-center lg:justify-end mt-6 xl:mt-8"
    >
      <div className="relative group perspective-1000">
        <motion.div
          className="relative w-[360px] xl:w-[420px] bg-card/50 border border-border/50 rounded-3xl shadow-2xl p-5 xl:p-6 flex flex-col items-center"
          style={{
            transform: "rotateY(-12deg) rotateX(5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex items-center gap-6 xl:gap-8 z-20" style={{ transform: "translateZ(30px)" }}>
            <SiTypescript 
              className="w-8 h-8 xl:w-9 xl:h-9 opacity-80 cursor-default text-primary hover:opacity-100 transition-opacity" 
              title="TypeScript"
            />
            <SiReact 
              className="w-8 h-8 xl:w-9 xl:h-9 opacity-80 cursor-default text-primary hover:opacity-100 transition-opacity" 
              title="React"
            />
            <SiNodedotjs 
              className="w-8 h-8 xl:w-9 xl:h-9 opacity-80 cursor-default text-primary hover:opacity-100 transition-opacity" 
              title="Node.js"
            />
            <SiPostgresql
              className="w-8 h-8 xl:w-9 xl:h-9 opacity-80 cursor-default text-primary hover:opacity-100 transition-opacity" 
              title="PostgreSQL"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 xl:gap-4 z-20 w-full mb-auto mt-4 xl:mt-5" style={{ transform: "translateZ(40px)" }}>
            <div className="text-center space-y-1.5 xl:space-y-2">
              <div className="text-6xl xl:text-7xl font-bold text-foreground">
                {age}
              </div>
              <div className="text-sm xl:text-base font-medium text-foreground/90 uppercase tracking-widest">
                {t("yearsOld")}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-sm xl:text-base text-foreground mt-1.5 xl:mt-2 bg-background/60 px-4 xl:px-5 py-1.5 xl:py-2 rounded-full border border-foreground/10 font-medium shadow-sm">
                <MapPin className="w-4 h-4" />
                Goiânia, GO - Brasil
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 xl:gap-6 w-full pt-3 xl:pt-4 border-t border-foreground/10">
              <div className="flex flex-col items-center gap-1 xl:gap-1.5">
                <span className="text-2xl xl:text-3xl font-bold text-primary">{yearsOfExperience}+</span>
                <span className="text-xs xl:text-sm text-foreground/70 uppercase tracking-wider font-semibold">{t("yrsXp")}</span>
              </div>
              <div className="flex flex-col items-center gap-1 xl:gap-1.5">
                <span className="text-2xl xl:text-3xl font-bold text-primary">
                  {visitorCount > 0 ? visitorCount.toLocaleString() : '...'}
                </span>
                <span className="text-xs xl:text-sm text-foreground/70 uppercase tracking-wider font-semibold flex items-center gap-1">
                  {t("visitors")} <Eye className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 xl:gap-1.5" title="Caffeine Level: High">
                <span className="text-2xl xl:text-3xl font-bold text-primary">∞</span>
                <span className="text-xs xl:text-sm text-foreground/70 uppercase tracking-wider font-semibold flex items-center gap-1">
                  {t("coffees")} <Coffee className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </span>
              </div>
            </div>
          </div>

          <div
            className="w-full pt-2 xl:pt-3 z-20 flex justify-center"
            style={{ transform: "translateZ(60px)" }}
          >
            <MorphingText
              texts={adjectives}
              className="text-2xl xl:text-3xl font-bold text-primary h-8 xl:h-10"
            />
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};
