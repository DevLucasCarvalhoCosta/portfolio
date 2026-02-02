"use client";

import { SocialLinks } from "@/components/ui/social-links";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur-sm relative z-50">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 tracking-tighter">
            LC.
          </span>
        </div>

        <div className="text-sm text-foreground/60 text-center font-medium">
          <p>© {currentYear} Lucas Carvalho. Espero que tenha gostado.</p>
        </div>

        <SocialLinks variant="simple" iconSize="md" />
      </div>
    </footer>
  );
};