"use client"

import React, { memo, useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

const generateMeteorStyles = (
  number: number,
  angle: number,
  minDelay: number,
  maxDelay: number,
  minDuration: number,
  maxDuration: number
) => {
  return [...new Array(number)].map(() => ({
    "--angle": -angle + "deg",
    top: `${Math.floor(Math.random() * 100)}%`,
    left: `${Math.floor(Math.random() * 100)}%`,
    animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
    animationDuration:
      Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
  } as React.CSSProperties & Record<string, string>));
};

const MeteorsInner = ({
  number = 15,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 3,
  maxDuration = 12,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties & Record<string, string>>>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Defer to next frame to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      setMeteorStyles(generateMeteorStyles(number, angle, minDelay, maxDelay, minDuration, maxDuration));
    });
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  if (meteorStyles.length === 0) return null;

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
            "will-change-transform backface-visibility-hidden",
            className
          )}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  )
}

export const Meteors = memo(MeteorsInner);
