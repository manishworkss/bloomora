import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sage' | 'terracotta' | 'outline' | 'amber';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface text-ink-muted border border-border-subtle',
    sage: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    terracotta: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    outline: 'border border-border-subtle text-ink bg-transparent',
    amber: 'bg-amber-100/70 text-amber-800 border border-amber-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

