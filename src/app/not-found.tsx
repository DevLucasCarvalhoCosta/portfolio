"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }} 
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="relative mb-8"
        >
          <h1 className="text-[12rem] md:text-[16rem] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Search className="w-24 h-24 md:w-32 md:h-32 text-primary/20" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/">
            <Button
              size="lg"
              className="group min-w-[200px]"
            >
              <Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              {t("homeButton")}
            </Button>
          </Link>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="min-w-[200px]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t("backButton")}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          {t("errorCode")}: <code className="px-2 py-1 rounded bg-muted text-primary font-mono">404</code>
        </motion.p>
      </div>
    </div>
  );
}
