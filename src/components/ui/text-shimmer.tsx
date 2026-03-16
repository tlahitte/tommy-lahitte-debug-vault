'use client';
import React, { useMemo, type JSX } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [background-repeat:no-repeat,padding-box]',
        className
      )}
      animate={{ backgroundPosition: ['100% center', '0% center'] }}
      transition={{
        repeat: Infinity,
        repeatType: 'mirror',
        duration,
        ease: 'easeInOut',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          '--bg': `linear-gradient(90deg, #0000 calc(50% - var(--spread)), var(--base-gradient-color) 50%, #0000 calc(50% + var(--spread)))`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
