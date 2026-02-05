"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslations, useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { SocialLinks } from "@/components/ui/social-links";
import { SplitText } from "@/components/ui/split-text";

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
    <section id="home" className={cn("relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-12 lg:pt-24 lg:pb-10", isShortHeight && "pt-16 pb-10 md:pt-20 md:pb-8 lg:pt-20 lg:pb-6")}>

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#53535312_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%,#000 70%,transparent 100%)" }}
      />

      <AuroraBackground />

      <div className={cn("container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-12 items-start lg:items-start relative z-10 flex-1 content-center", isShortHeight && "gap-3 lg:gap-4")}>
        <div
          className={cn("flex flex-col items-start text-left space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8", isShortHeight && "space-y-2 md:space-y-2 lg:space-y-3")}
        >
          <div className={cn("flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-3", isShortHeight && "gap-1 md:gap-1")}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className={cn("text-sm sm:text-base md:text-base lg:text-lg font-bold tracking-[0.2em] text-primary pl-1", isShortHeight && "text-xs md:text-sm lg:text-base")}
            >
              {t("greeting")}
            </motion.span>
            <h1 className={cn("text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-foreground drop-shadow-sm leading-none", isShortHeight && "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl")}>
              <SplitText
                animation="slideUp"
                delay={0.4}
                staggerChildren={0.05}
                duration={0.8}
              >
                Lucas
              </SplitText>
              <SplitText
                animation="slideUp"
                delay={0.7}
                staggerChildren={0.05}
                duration={0.8}
                className="text-foreground/90"
              >
                Carvalho
              </SplitText>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn("space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 max-w-2xl", isShortHeight && "space-y-1 md:space-y-2 lg:space-y-2")}
          >
            <h2 className={cn("text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground", isShortHeight && "text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl")}>
              {t("role")}
            </h2>
            <p className={cn("text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-foreground/80 leading-relaxed max-w-xl font-medium", isShortHeight && "text-xs md:text-sm lg:text-base xl:text-lg")}>
              <HighlightedText text={t("description")} boldOnly />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn("flex flex-wrap items-center gap-3 sm:gap-4 md:gap-4 lg:gap-5", isShortHeight && "gap-2 md:gap-3 lg:gap-4")}
          >
            <SocialLinks variant="button" iconSize="md" includeWhatsapp={true} className={cn("gap-2 md:gap-3 lg:gap-4", isShortHeight && "gap-2 md:gap-2")} />
            
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
              className="group inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-foreground text-background rounded-lg font-bold text-sm sm:text-base transition-all hover:bg-foreground/90 hover:scale-105 active:scale-95 shadow-lg shadow-foreground/20"
            >
              {t("viewProjects")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={`/cv-${locale}.pdf`}
              download={`CV-Lucas-Carvalho-${locale.toUpperCase()}.pdf`}
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-card/50 border border-foreground/20 text-foreground rounded-lg font-bold text-sm sm:text-base transition-all hover:bg-foreground hover:text-background hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              {t("downloadCv")}
            </a>
          </motion.div>
        </div>

        <HeroCard adjectives={adjectives} />
      </div>

      <motion.div
        className={cn("absolute bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground/50", isShortHeight && "bottom-2 md:bottom-3 lg:bottom-4")}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className={cn("w-5 h-5 md:w-6 md:h-6 text-foreground", isShortHeight && "w-4 h-4")} />
      </motion.div>
    </section>
  );
};
