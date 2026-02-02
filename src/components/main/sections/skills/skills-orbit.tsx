"use client";

import { useTranslations } from "next-intl";
import skillsData from "@/data/main/skills.json";
import { Code2, Database, Server, Wrench, Languages, FileCode } from "lucide-react";
import { SectionHeader } from "@/components/utils/section-header";
import { WaveDivider } from "@/components/ui/wave-divider";
import { Meteors } from "@/components/ui/meteors";
import { SkillOrbit } from "@/components/ui/skill-orbit";

const categoryIcons = {
    core: FileCode,
    frontend: Code2,
    backend: Server,
    database: Database,
    tools: Wrench,
    languages: Languages,
} as const;

const categoryColors = {
    core: "#F7DF1E",
    frontend: "#61DAFB",
    backend: "#339933",
    database: "#4169E1",
    tools: "#F05032",
    languages: "#009739",
} as const;

export function SkillsSectionOrbit() {
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
                <Meteors number={15} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 20% 50%, hsl(var(--primary)) 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, hsl(var(--primary)) 1px, transparent 1px)
            `,
                        backgroundSize: '100px 100px',
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
            </div>

            <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-8">
                <SectionHeader
                    title={t("title")}
                    subtitle={t("subtitle")}
                    align="center"
                    className="mb-12"
                />

                <div className="flex items-center justify-center gap-2 text-foreground/80 mb-10 bg-primary/5 w-fit mx-auto px-4 py-2 rounded-full border border-primary/10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <p className="text-sm font-medium">
                        {t("hoverHint")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 place-items-center">
                    {categories.map((category, index) => {
                        const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
                        const color = categoryColors[category.key as keyof typeof categoryColors];

                        return (
                            <div
                                key={category.key}
                                className="flex items-center justify-center w-full"
                            >
                                <SkillOrbit
                                    title={t(category.key)}
                                    icon={Icon}
                                    skills={category.skills}
                                    color={color}
                                    index={index}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default SkillsSectionOrbit;
