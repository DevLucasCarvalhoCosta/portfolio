"use client";

import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/utils/section-header";

import Image from "next/image";

import { Briefcase, Code, GraduationCap, Laptop } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import experienceData from "@/data/main/experience.json";

import { HighlightedText } from "@/lib/highlight-parser";

export function ExperienceSection() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const lang = locale as "pt" | "en";

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
          className="p-4 md:p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm transition-[border-color,box-shadow] duration-300 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 md:gap-y-4">
            {hasLogo ? (
              <div className="rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300 h-fit w-fit">
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
              <div className="p-2 md:p-3 rounded-xl border bg-primary/10 border-primary/20 group-hover:scale-110 transition-transform duration-300 h-fit">
                <div className="p-1">
                  {icons[index] || <Briefcase className="w-6 h-6 text-primary" />}
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight group-hover:text-primary/80 transition-colors leading-tight">
                {job.title[lang]}
              </h3>
              <p className="text-foreground/80 font-medium text-base md:text-lg mt-1">
                {job.company}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 md:col-start-2">
              <div className="text-foreground/90 text-sm md:text-lg leading-relaxed">
                <HighlightedText text={job.description[lang]} />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 md:col-start-2 flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors"
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
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"
        style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 80%,transparent 100%)" }}
      />

      <div className="w-full px-4 md:px-8 pt-20">
        <div className="container max-w-7xl mx-auto relative z-10">
          <SectionHeader 
            title={t("title")} 
            subtitle={t("subtitle")} 
            align="left"
            className="mb-12"
          />
        </div>
      </div>
      <Timeline data={data} />
    </section>
  );
}
