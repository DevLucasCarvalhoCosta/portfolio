"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { HighlightedText } from "@/lib/highlight-parser";
import { SectionHeader } from "@/components/utils/section-header";
import { AmbientLight } from "@/components/ui/ambient-light";
import { SocialLinks } from "@/components/ui/social-links";
import { MagneticButton } from "@/components/ui/magnetic-button";
import contactData from "@/data/main/contact.json";
import { Highlighter } from "@/components/ui/highlighter";

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale() as "pt" | "en";

  const contactInfo = [
    {
      icon: Mail,
      label: t("email"),
      value: contactData.email.value,
      href: contactData.email.href,
      className: "break-all",
    },
    {
      icon: Phone,
      label: t("phone"),
      value: contactData.phone.value,
      href: contactData.phone.href,
    },
    {
      icon: MapPin,
      label: t("location"),
      value: contactData.location.value,
      href: contactData.location.href,
    },
  ];

  return (
    <section id="contact" className="w-full bg-background relative overflow-hidden py-24 md:py-32">
      <AmbientLight />

      <div className="w-full px-4 md:px-8 relative z-10">
        <div className="container max-w-4xl mx-auto text-center">

          <SectionHeader
            title={t("title")}
            align="center"
            className="mb-16 md:mb-20"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {t("cta")}
            </h3>
            <p className="text-foreground/60 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              {t("ctaDescription")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center group p-8 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <info.icon className="w-7 h-7" />
                </div>
                <h4 className="relative text-xl font-bold text-foreground mb-2">{info.label}</h4>
                <span className={`relative text-foreground/70 text-base md:text-lg text-center font-medium max-w-full ${info.className || "break-words"}`}>
                  {info.value}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-12"
          >
            <SocialLinks variant="button" iconSize="lg" className="gap-8" />

            <MagneticButton
              as="a"
              href={contactData.whatsapp.href[locale]}
              target="_blank"
              rel="noopener noreferrer"
              magneticStrength={0.4}
              className="inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-full font-bold text-xl hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <SiWhatsapp className="w-7 h-7 text-[#25D366] group-hover:text-background transition-colors" />
              <span>{t("whatsapp")}</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}