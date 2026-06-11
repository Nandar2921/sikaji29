import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={cn('bg-white shadow-sm rounded-lg', className)} {...props}>{children}</div>;
}