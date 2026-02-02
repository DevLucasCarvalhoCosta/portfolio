
export const easings = {
  smooth: [0.25, 0.4, 0.25, 1] as const,
  
  snappy: [0.4, 0, 0.2, 1] as const,
  
  bounce: [0.175, 0.885, 0.32, 1.275] as const,
  
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  
  expoOut: [0.16, 1, 0.3, 1] as const,
  
  circOut: [0, 0.55, 0.45, 1] as const,
  
  backOut: [0.34, 1.56, 0.64, 1] as const,
  
  quintOut: [0.22, 1, 0.36, 1] as const,
};

export const springs = {
  default: {
    type: "spring" as const,
    stiffness: 280,
    damping: 28,
    mass: 0.7,
    restDelta: 0.01,
    restSpeed: 0.01,
  },
  
  bouncy: {
    type: "spring" as const,
    stiffness: 350,
    damping: 18,
    mass: 0.4,
    restDelta: 0.01,
  },
  
  stiff: {
    type: "spring" as const,
    stiffness: 450,
    damping: 35,
    mass: 0.25,
    restDelta: 0.001,
    restSpeed: 0.001,
  },
  
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 18,
    mass: 0.8,
    restDelta: 0.1,
  },
  
  slow: {
    type: "spring" as const,
    stiffness: 80,
    damping: 22,
    mass: 1,
    restDelta: 0.1,
  },
  
  micro: {
    type: "spring" as const,
    stiffness: 500,
    damping: 40,
    mass: 0.2,
    restDelta: 0.001,
  },
};

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  medium: 0.5,
  slow: 0.8,
  slower: 1.2,
  slowest: 2,
};

export const stagger = {
  fast: 0.03,
  normal: 0.05,
  medium: 0.08,
  slow: 0.12,
};

export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: "blur(4px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

export const fadeInDown = {
  hidden: { 
    opacity: 0, 
    y: -30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: easings.backOut,
    },
  },
};

export const slideUp = {
  hidden: { 
    opacity: 0, 
    y: 60,
    filter: "blur(8px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: easings.expoOut,
    },
  },
};

export const staggerContainer = (staggerDelay = stagger.normal, delay = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delay,
    },
  },
});

export const hoverScale = {
  scale: 1.05,
  transition: { duration: durations.fast, ease: easings.snappy },
};

export const hoverLift = {
  y: -5,
  transition: { duration: durations.fast, ease: easings.snappy },
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(var(--primary-rgb), 0.3)",
  transition: { duration: durations.normal },
};

export const tapScale = {
  scale: 0.95,
  transition: { duration: durations.instant },
};

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

export const createTransition = (
  duration = durations.normal,
  ease = easings.smooth,
  delay = 0
) => ({
  duration,
  ease,
  delay,
});

export const viewportConfig = {
  once: true,
  margin: "-10%",
  amount: 0.3,
};
