"use client";

import { useEffect } from "react";
import skillsData from "@/data/main/skills.json";

export function PreloadSkillsIcons() {
  useEffect(() => {
    const allSkills = [
      ...skillsData.core,
      ...skillsData.frontend,
      ...skillsData.backend,
      ...skillsData.database,
      ...skillsData.tools,
      ...skillsData.languages,
    ];

    const preloadImages = () => {
      allSkills.forEach((skill, index) => {
        if ("iconUrl" in skill && skill.iconUrl) {
          const img = new Image();
          img.src = skill.iconUrl;
          img.crossOrigin = "anonymous";
        }
      });
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        preloadImages();
      } else {
        window.addEventListener("load", preloadImages, { once: true });
      }
    }
  }, []);

  return null;
}
