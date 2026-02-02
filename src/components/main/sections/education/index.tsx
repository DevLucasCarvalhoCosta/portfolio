"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Timeline } from "@/components/ui/timeline";
import { EducationCard } from "./education-card";
import { SectionHeader } from "@/components/utils/section-header";

import educationData from "@/data/main/education.json";

export function EducationSection() {
  const t = useTranslations("education");
  const locale = useLocale() as "pt" | "en";

  const timelineData = educationData.map((edu) => ({
    title: edu.date[locale],
    content: <EducationCard education={edu} index={educationData.indexOf(edu)} />,
  }));

  return (
    <section
      id="education"
      className="w-full bg-background relative overflow-hidden pt-4 md:pt-24"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none origin-center"
      >
        <svg className="w-full h-full opacity-30 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" className="fill-foreground" />
            </pattern>
            <mask id="fade-mask">
              <rect width="100%" height="100%" fill="url(#mask-gradient)" />
            </mask>
            <linearGradient id="mask-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="5%" stopColor="white" stopOpacity="1" />
              <stop offset="95%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" mask="url(#fade-mask)" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-background z-0 pointer-events-none" />

      <div className="w-full relative z-10">
        <div className="container max-w-7xl mx-auto">
          <SectionHeader 
            title={t("title")} 
            subtitle={t("subtitle")} 
            align="left"
            className="px-4 mb-4 md:mb-6"
          />

          <Timeline data={timelineData} />
        </div>
      </div>
    </section>
  );
}
