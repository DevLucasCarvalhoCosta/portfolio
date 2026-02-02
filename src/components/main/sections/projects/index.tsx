"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { SectionHeader } from "@/components/utils/section-header";
import projectsData from "@/data/main/projects.json";
import { MagicCardProvider } from "@/components/ui/magic-card-context";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const lang = locale as "pt" | "en";

  return (
    <section id="projects" className="w-full bg-background relative py-20 pb-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-48 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-48 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-4 md:px-8">
        <div className="container max-w-7xl mx-auto relative z-10">
          <SectionHeader 
            title={t("title")} 
            subtitle={t("subtitle")} 
            align="left"
            className="mb-12"
          />

          <MagicCardProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {projectsData.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title[lang]}
                  description={project.description[lang]}
                  image={project.image}
                  technologies={project.technologies}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  index={index}
                />
              ))}
            </div>
          </MagicCardProvider>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link
              href="https://github.com/DevLucasCarvalhoCosta?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 rounded-lg border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
            >
              <SiGithub className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-foreground group-hover:text-primary transition-colors font-medium">
                {t("viewAll")}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
