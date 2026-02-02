import { SiGithub } from "@icons-pack/react-simple-icons";

import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { HighlightedText } from "@/lib/highlight-parser";

import { LinkPreview } from "@/components/ui/link-preview";
import { MagicCard } from "@/components/ui/magic-card";
import { TiltCard } from "@/components/ui/tilt-card";

import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  index: number;
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  index,
}: ProjectCardProps) {
  const isFeatured = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        ease: [0.25, 0.4, 0.25, 1], 
        delay: index * 0.1 
      }}
      className="h-full"
    >
      <TiltCard 
        className="h-full" 
        tiltMaxAngle={6} 
        scale={1.02}
        glareOpacity={0.08}
      >
        <MagicCard className="h-full flex flex-col rounded-2xl overflow-hidden group">
          <div className="relative h-56 bg-linear-to-br from-primary/10 to-primary/5 overflow-hidden">
            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 text-primary-foreground rounded-full text-xs font-semibold shadow-lg">
                <Sparkles className="w-3 h-3" />
                Destaque
              </div>
            )}
            
            {/* Project number */}
            <div className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full text-sm font-bold text-foreground/70 border border-border/50">
              {String(index + 1).padStart(2, '0')}
            </div>

            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold text-foreground/10">{title.charAt(0)}</div>
              </div>
            )}
            
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-60" />
          </div>

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>

            <div className="text-foreground/80 text-sm leading-relaxed line-clamp-4">
              <HighlightedText text={description} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 5 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-foreground/5 text-foreground/60">
                  +{technologies.length - 5}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-4">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/50 transition-all hover:border-foreground/20"
              >
                <SiGithub className="w-4 h-4" />
                <span>Código</span>
              </a>
            )}

            {liveUrl && (
              <LinkPreview url={liveUrl} className="no-underline flex-1">
                <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer w-full">
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Demo</span>
                </div>
              </LinkPreview>
            )}
          </div>
        </div>
      </MagicCard>
      </TiltCard>
    </motion.div>
  );
}
