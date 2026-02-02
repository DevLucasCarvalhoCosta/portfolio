"use client";

import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/utils/section-header";

import Image from "next/image";

import { Briefcase, Code, GraduationCap, Laptop, Calendar, TrendingUp } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import experienceData from "@/data/main/experience.json";

import { HighlightedText } from "@/lib/highlight-parser";

export function ExperienceSection() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const lang = locale as "pt" | "en";

  // Calculate total years of experience
  const totalYears = new Date().getFullYear() - 2014;

  const icons = [
    <Laptop key="laptop" className="w-6 h-6 text-primary" />,
    <Code key="code" className="w-6 h-6 text-primary" />,
    <Briefcase key="briefcase" className="w-6 h-6 text-primary" />,
    <GraduationCap key="grad" className="w-6 h-6 text-primary" />,
  ];

  const data = experienceData.map((job, index) => {
    const hasLogo = !!job.logo;

    return {
      title: job.date[lang],
      content: (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
          className="group p-5 md:p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:bg-card/60 relative overflow-hidden"
        >
          {/* Gradient accent on hover */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Number indicator */}
          <div className="absolute top-4 right-4 text-6xl font-black text-foreground/3 group-hover:text-primary/10 transition-colors duration-300">
            0{index + 1}
          </div>

          <div className="relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 md:gap-y-4">
            {hasLogo ? (
              <div className="rounded-xl overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-300 h-fit w-fit group-hover:scale-105">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={56}
                  height={56}
                  className="w-12 h-12 md:w-14 md:h-14 object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="p-2 md:p-3 rounded-xl border bg-primary/10 border-primary/20 group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300 h-fit">
                <div className="p-1">
                  {icons[index] || <Briefcase className="w-6 h-6 text-primary" />}
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                {job.title[lang]}
              </h3>
              <p className="text-foreground/70 font-semibold text-base md:text-lg mt-0.5">
                {job.company}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 md:col-start-2">
              <div className="text-foreground/80 text-sm md:text-base leading-relaxed">
                <HighlightedText text={job.description[lang]} />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 md:col-start-2 flex flex-wrap gap-2 pt-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/15 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ),
    };
  });

  return (
    <section id="experience" className="w-full bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"
        style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 80%,transparent 100%)" }}
      />

      <div className="w-full px-4 md:px-8 pt-20">
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeader 
              title={t("title")} 
              subtitle={t("subtitle")} 
              align="left"
              className="mb-0"
            />
            
            {/* Experience summary badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 px-5 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/70">{totalYears}+ anos</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-foreground/70">{experienceData.length} posições</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Timeline data={data} />
    </section>
  );
}
