"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";

import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";

export function Header() {
  const lastYRef = useRef(0);
  const isScrollingToSectionRef = useRef(false);
  const { scrollY } = useScroll();
  
  const t = useTranslations("header");

  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#home");

  const NAV_ITEMS = [
    { href: "#home", label: t("home") },
    { href: "#experience", label: t("experience") },
    { href: "#projects", label: t("projects") },
    { href: "#skills", label: t("skills") },
    { href: "#education", label: t("education") },
    { href: "#contact", label: t("contact") },
  ];

  useEffect(() => {
    lastYRef.current = typeof window !== "undefined" ? window.scrollY : 0;
  }, []);

  useEffect(() => {
    const currentScroll = typeof window !== "undefined" ? window.scrollY : 0;
    if (currentScroll < 80 && hidden) {
      const timer = setTimeout(() => setHidden(false), 0);
      return () => clearTimeout(timer);
    }
  }, [t, hidden]);

  // Scroll Spy - detect active section
  useEffect(() => {
    const sectionIds = ["home", "experience", "projects", "skills", "education", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = `#${entry.target.id}`;
            setActiveSection(href);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px", 
        threshold: 0.1
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isScrollingToSectionRef.current) {
      lastYRef.current = latest;
      return;
    }

    const last = lastYRef.current;
    const delta = latest - last;
    const threshold = 80;
    const minorDelta = 6;

    if (latest < threshold) {
      setHidden(false);
    } else if (delta > minorDelta) {
      setHidden(true);
    } else if (delta < -minorDelta) {
      setHidden(false);
    }

    lastYRef.current = latest;
  });

  return (
    <>
      <DesktopHeader 
        hidden={hidden} 
        navItems={NAV_ITEMS} 
        activeSection={activeSection}
        isScrollingToSectionRef={isScrollingToSectionRef}
      />
      <MobileHeader hidden={hidden} navItems={NAV_ITEMS} />
    </>
  );
}