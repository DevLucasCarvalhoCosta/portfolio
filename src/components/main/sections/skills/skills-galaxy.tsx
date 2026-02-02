"use client";

import { useTranslations } from "next-intl";

import skillsData from "@/data/main/skills.json";

import { Code2, Database, Server, Wrench, Languages, FileCode } from "lucide-react";

import { SectionHeader } from "@/components/utils/section-header";
import { WaveDivider } from "@/components/ui/wave-divider";
import { SkillConstellation } from "@/components/ui/skill-constellation";

const categoryIcons = {
  core: FileCode,
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Wrench,
  languages: Languages,
} as const;

export function SkillsSectionGalaxy() {
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
      
      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, hsl(var(--primary)), transparent),
              radial-gradient(1px 1px at 40px 70px, hsl(var(--primary) / 0.8), transparent),
              radial-gradient(1px 1px at 50px 160px, hsl(var(--primary) / 0.6), transparent),
              radial-gradient(1px 1px at 90px 40px, hsl(var(--primary) / 0.7), transparent),
              radial-gradient(1px 1px at 130px 80px, hsl(var(--primary)), transparent),
              radial-gradient(1px 1px at 160px 120px, hsl(var(--primary) / 0.5), transparent)
            `,
            backgroundSize: '200px 200px',
          }} 
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-8">
        <SectionHeader 
          title={t("title")} 
          subtitle={t("subtitle")} 
          align="center"
          className="mb-8" 
        />

        {/* Info hint */}
        <div className="flex items-center justify-center gap-2 text-foreground/80 mb-10 bg-primary/5 w-fit mx-auto px-4 py-2 rounded-full border border-primary/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <p className="text-sm font-medium">
            Explore as constelações de habilidades
          </p>
        </div>

        {/* Constellation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
            
            return (
              <SkillConstellation
                key={category.key}
                title={t(category.key)}
                icon={Icon}
                skills={category.skills}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SkillsSectionGalaxy;
