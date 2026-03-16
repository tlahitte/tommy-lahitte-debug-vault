'use client';
import { cn } from '@/lib/utils';
import React, { type ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center bg-[var(--surface-raised)] text-text-primary transition-colors',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--aurora:repeating-linear-gradient(100deg,var(--aurora-1)_10%,var(--aurora-2)_15%,var(--aurora-3)_20%,var(--aurora-4)_25%,var(--aurora-1)_30%)]
            [--surface-gradient:repeating-linear-gradient(100deg,var(--surface-raised)_0%,var(--surface-raised)_7%,transparent_10%,transparent_12%,var(--surface-raised)_16%)]
            [background-image:var(--surface-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px]
            after:content-[""] after:absolute after:inset-0
            after:[background-image:var(--surface-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-soft-light
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]'
          )}
        />
      </div>
      {children}
    </div>
  );
}
