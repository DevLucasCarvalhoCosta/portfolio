"use client";

import { useTranslations } from "next-intl";

import skillsData from "@/data/main/skills.json";

import { Code2, Database, Server, Wrench, MousePointerClick, Languages, FileCode } from "lucide-react";

import { SectionHeader } from "@/components/utils/section-header";
import { WaveDivider } from "@/components/ui/wave-divider";
import { Meteors } from "@/components/ui/meteors";
import { Spotlight } from "@/components/ui/spotlight";

import { SkillCard } from "./skill-card";

const categoryIcons = {
  core: FileCode,
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Wrench,
  languages: Languages,
} as const;

export function SkillsSection() {
  const t = useTranslations("skills");

  const categories = [
    { key: "core", skills: skillsData.core },
    { key: "frontend", skills: skillsData.frontend },
    { key: "backend", skills: skillsData.backend },
    { key: "database", skills: skillsData.database },
    { key: "tools", skills: skillsData.tools },
    { key: "languages", skills: skillsData.languages },
  ];

  return (
    <section id="skills" className="w-full bg-background relative overflow-hidden pb-20 pt-8 md:pt-0">
      <WaveDivider />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Meteors number={20} />
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }} 
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      <Spotlight 
        className="w-full px-4 md:px-8"
        spotlightSize={600}
        spotlightOpacity={0.06}
      >
        <div className="container max-w-7xl mx-auto relative z-10">
          <SectionHeader 
            title={t("title")} 
            subtitle={t("subtitle")} 
            align="left"
            className="mb-8" 
          />

          <div className="flex items-center gap-2 text-foreground/80 mb-10 bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
            <MousePointerClick className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">
              {t("hoverHint")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-6 relative z-10">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
              const isLastAndOdd = index === categories.length - 1 && categories.length % 2 !== 0;
              
              return (
                <div 
                  key={category.key}
                  className={isLastAndOdd ? "md:col-span-2 md:max-w-2xl md:mx-auto md:w-full" : ""}
                >
                  <SkillCard
                    title={t(category.key)}
                    icon={Icon}
                    skills={category.skills}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
