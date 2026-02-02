"use client";

import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { HighlightedText } from "@/lib/highlight-parser";

interface EducationData {
  institution: string;
  logo: string;
  degree: { pt: string; en: string };
  field: { pt: string; en: string };
  date: { pt: string; en: string };
  status: { pt: string; en: string };
  description: { pt: string; en: string };
  skills?: string[];
}

interface EducationCardProps {
  education: EducationData;
  index: number;
}

function StatusBadge({ 
  status, 
  isOngoing, 
  className 
}: { 
  status: string; 
  isOngoing: boolean; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold w-fit ${
      isOngoing 
        ? "bg-primary/20 text-primary border border-primary/30" 
        : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
    } ${className || ""}`}>
      {isOngoing ? (
        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
      ) : (
        <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
      )}
      {status}
    </div>
  );
}

export function EducationCard({ education, index }: EducationCardProps) {
  const locale = useLocale() as "pt" | "en";
  
  const isOngoing = education.status.en.toLowerCase() === "ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative"
    >
      <div className="relative rounded-2xl border border-primary/20 bg-linear-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-sm p-4 md:p-8 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="hidden md:block absolute top-6 right-6 z-10">
          <StatusBadge status={education.status[locale]} isOngoing={isOngoing} />
        </div>

        <div className="flex items-start gap-4 mb-4 md:mb-6 relative z-10">
          <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-900 flex items-center justify-center border border-primary/20 p-2 shadow-md hover:scale-105 transition-transform duration-300">
            <Image
              src={education.logo}
              alt={education.institution}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
              {education.institution}
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-sm text-foreground/70">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span className="font-semibold line-clamp-1">
                  {education.degree[locale]}
                </span>
              </div>
              <span className="hidden md:inline">•</span>
              <span className="font-medium opacity-90 line-clamp-1 md:line-clamp-none">
                {education.field[locale]}
              </span>
            </div>
          </div>
        </div>

        <div className="md:hidden mb-3 relative z-10">
          <StatusBadge status={education.status[locale]} isOngoing={isOngoing} />
        </div>

        <div className="text-sm md:text-base text-foreground/90 leading-relaxed mb-4 md:mb-6 relative z-10">
          <HighlightedText text={education.description[locale]} />
        </div>

        {education.skills && education.skills.length > 0 && (
          <div className="relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {education.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: index * 0.15 + skillIndex * 0.03,
                  }}
                  className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] md:text-xs font-medium text-foreground/80 text-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-linear-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}
