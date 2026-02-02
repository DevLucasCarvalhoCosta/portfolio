import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { Header } from "@/components/main/utils/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonSchema, getWebSiteSchema } from "@/lib/schema";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { ConsoleArt } from "@/components/ui/console-art";
import { Footer } from "@/components/main/utils/footer";
import { PreloadSkillsIcons } from "@/components/utils/preload-skills-icons";
import { PixelatedText } from "@/components/ui/pixelated-text";

import "../styles/reduced-motion.css";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lucascarvalho.dev'),
  title: {
    default: 'Lucas Carvalho | Desenvolvedor Full-Stack',
    template: '%s | Lucas Carvalho'
  },
  description: 'Desenvolvedor Full-Stack com experiência em todo o ciclo de desenvolvimento. Especializado em React, TypeScript, Node.js e bancos de dados. Perfil orientado a resultados.',
  keywords: [
    'Full Stack Developer',
    'Desenvolvedor Full Stack',
    'React Developer',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Java',
    'Spring Boot',
    'PostgreSQL',
    'Web Development',
    'Portfolio',
    'Lucas Carvalho',
  ],
  authors: [{ name: 'Lucas Carvalho Costa', url: 'https://lucascarvalho.dev' }],
  creator: 'Lucas Carvalho Costa',
  publisher: 'Lucas Carvalho Costa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: 'https://lucascarvalho.dev',
    siteName: 'Lucas Carvalho - Portfolio',
    title: 'Lucas Carvalho | Desenvolvedor Full-Stack',
    description: 'Desenvolvedor Full-Stack com experiência em todo o ciclo de desenvolvimento. Especializado em React, TypeScript, Node.js e bancos de dados.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Lucas Carvalho - Desenvolvedor Full-Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Carvalho | Desenvolvedor Full-Stack',
    description: 'Desenvolvedor Full-Stack com mais de 12 anos de experiência. Especialista em React, Next.js, Node.js, Java e Spring Boot.',
    images: ['/opengraph-image.png'],
    creator: '@devlucascarvalho',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  const cookieStore = await cookies();
  const themeHue = cookieStore.get("theme-hue")?.value;
  const hue = themeHue ? parseInt(themeHue, 10) : 290; // Default purple

  return (
    <html lang={locale} suppressHydrationWarning style={{
      '--theme-hue': hue,
    } as React.CSSProperties}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteSchema()),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SpeedInsights />
            <PreloadSkillsIcons />
            <MotionConfig reducedMotion="user">
              <ConsoleArt />
              <ScrollProgress />
              <Header />
              {children}
              <Footer />
              <div className="w-full bg-background/50 border-t border-border/20 py-4 md:py-6">
                <PixelatedText
                  text="LUCAS"
                  className="w-full max-w-6xl mx-auto px-4"
                  gridSize={14}
                  dotSize={2.5}
                  textOpacity={0.45}
                  bgOpacity={0.06}
                />
              </div>
              <BackToTop />
            </MotionConfig>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
