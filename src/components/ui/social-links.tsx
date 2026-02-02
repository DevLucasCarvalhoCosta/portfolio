"use client";

import { useLocale } from "next-intl";
import { Github, Linkedin } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";
import contactData from "@/data/main/contact.json";

interface SocialLinksProps {
  className?: string; // Container className
  variant?: "simple" | "button";
  iconSize?: "sm" | "md" | "lg" | "xl";
  includeWhatsapp?: boolean;
}

const socials = [
  {
    name: "Github",
    href: "https://github.com/DevLucasCarvalhoCosta",
    icon: Github,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/devlucascarvalhocosta/",
    icon: Linkedin,
  },
];

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
};

export function SocialLinks({ className, variant = "simple", iconSize = "md", includeWhatsapp = false }: SocialLinksProps) {
  const locale = useLocale() as "pt" | "en";
  
  const allSocials = includeWhatsapp 
    ? [...socials, { name: "Whatsapp", href: contactData.whatsapp.href[locale], icon: SiWhatsapp }] 
    : socials;

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {allSocials.map((social) => {
        const Icon = social.icon;
        
        if (variant === "button") {
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 md:p-4 rounded-lg md:rounded-full bg-card border border-primary/40 md:border-foreground/10 dark:md:border-white/20 hover:bg-primary/20 hover:text-primary hover:border-primary/60 text-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm"
              aria-label={social.name}
            >
              <Icon className={cn(sizeMap[iconSize])} />
            </a>
          );
        }

        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 dark:text-foreground/80 hover:text-primary dark:hover:text-primary transition-colors hover:scale-110 transform duration-200"
            aria-label={social.name}
          >
            <Icon className={cn(sizeMap[iconSize])} />
          </a>
        );
      })}
    </div>
  );
}
