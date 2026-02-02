"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export const LanguageToggler = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const langParam = searchParams.get("lang");
    
    if (langParam && ["en", "pt"].includes(langParam) && langParam !== locale) {
      document.cookie = `locale=${langParam}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Remove o parâmetro lang da URL para evitar loops
      searchParams.delete("lang");
      const newUrl = window.location.pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.replace(newUrl);
      router.refresh();
    }
  }, [locale, router]);

  const toggleLanguage = useCallback(() => {
    const newLocale = locale === "pt" ? "en" : "pt";

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    router.refresh();
  }, [locale, router]);

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "relative flex items-center justify-center p-2 rounded-md border transition-all min-w-[36px]",
        "border-foreground/20 dark:border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
        className
      )}
      {...props}
    >
      <Globe size={16} />
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-md">
        {locale.toUpperCase()}
      </span>
      <span className="sr-only">Toggle language</span>
    </button>
  );
};
