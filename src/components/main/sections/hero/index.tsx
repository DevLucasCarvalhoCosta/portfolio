"use client";

import { motion } from "motion/react";
import { Download, ArrowRight, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslations, useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { SocialLinks } from "@/components/ui/social-links"; 

import { HighlightedText } from "@/lib/highlight-parser"; 

import { AuroraBackground } from "./backgrounds/aurora";
import { HeroCard } from "./card";

export const HeroSection = () => {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [isShortHeight, setIsShortHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsShortHeight(window.innerHeight < 800);
    };
    
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  const adjectives = [
    t("adjectives.0"),
    t("adjectives.1"),
    t("adjectives.2"),
    t("adjectives.3"),
    t("adjectives.4"),
  ];

  return (
    <section id="home" className={cn("relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8 py-4 md:py-2 lg:py-0", isShortHeight && "py-2 md:py-1 lg:py-0")}>

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#53535312_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%,#000 70%,transparent 100%)" }}
      />

      <AuroraBackground />

      <div className={cn("container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-6 lg:gap-10 xl:gap-16 items-center relative z-10 flex-1 py-2 md:py-1 lg:py-0", isShortHeight && "gap-4 lg:gap-6")}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn("flex flex-col items-start text-left space-y-6 md:space-y-8 lg:space-y-8 xl:space-y-10", isShortHeight && "space-y-2 md:space-y-2 lg:space-y-3")}
        >
          <div className={cn("flex flex-col gap-3 md:gap-4 lg:gap-4", isShortHeight && "gap-1 md:gap-1")}>
            <span className={cn("text-base md:text-base lg:text-lg font-bold tracking-[0.2em] text-primary pl-1", isShortHeight && "text-sm md:text-sm lg:text-base")}>
              {t("greeting")}
            </span>
            <h1 className={cn("text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-foreground drop-shadow-sm leading-none", isShortHeight && "text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl")}>
              Lucas
              <br />
              <span className="text-foreground/90">Carvalho</span>
            </h1>
          </div>

          <div className={cn("space-y-6 md:space-y-8 lg:space-y-8 xl:space-y-10 max-w-2xl", isShortHeight && "space-y-2 md:space-y-2 lg:space-y-3")}>
            <h2 className={cn("text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground", isShortHeight && "text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl")}>
              {t("role")}
            </h2>
            <p className={cn("text-base md:text-base lg:text-lg xl:text-xl text-foreground/80 leading-relaxed max-w-xl font-medium", isShortHeight && "text-sm md:text-sm lg:text-base xl:text-lg")}>
              <HighlightedText text={t("description")} boldOnly />
            </p>
          </div>

          <div className={cn("flex items-center gap-4 md:gap-3 lg:gap-4", isShortHeight && "gap-2 md:gap-2 lg:gap-3")}>
            <SocialLinks variant="button" iconSize="md" includeWhatsapp={true} className={cn("gap-3 md:gap-3 lg:gap-4", isShortHeight && "gap-2 md:gap-2")} />
          </div>

          <div className={cn("flex flex-wrap gap-4 md:gap-4 lg:gap-4 pt-4 md:pt-6 lg:pt-6", isShortHeight && "gap-2 md:gap-2 lg:gap-3 pt-1 md:pt-0.5 lg:pt-1")}>
            <button
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById('projects');
                if (section) {
                  const headerOffset = 80;
                  const elementPosition = section.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="group inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-foreground text-background rounded-lg font-bold transition-all hover:bg-foreground/90 hover:scale-105 active:scale-95 shadow-lg shadow-foreground/20"
            >
              {t("viewProjects")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={`/CV - Lucas Carvalho Costa - ${locale}.pdf`}
              target="_blank"
              download
              className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-card/50 border border-foreground/20 text-foreground rounded-lg font-bold transition-all hover:bg-foreground hover:text-background hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              {t("downloadCv")}
            </a>
          </div>
        </motion.div>

        <HeroCard adjectives={adjectives} />
      </div>

      <motion.div
        className={cn("absolute bottom-8 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground/50", isShortHeight && "bottom-4 md:bottom-3 lg:bottom-4")}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className={cn("w-6 h-6 text-foreground", isShortHeight && "w-5 h-5")} />
      </motion.div>
    </section>
  );
};
