import { ExperienceSection } from "@/components/main/sections/experiences";
import { EducationSection } from "@/components/main/sections/education";
import { ProjectsSection } from "@/components/main/sections/projects";
import { ContactSection } from "@/components/main/sections/contact";
import { SkillsSectionOrbit } from "@/components/main/sections/skills/skills-orbit";
import { HeroSection } from "@/components/main/sections/hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSectionOrbit />
      <EducationSection />
      <ContactSection />
    </div>
  );
}
