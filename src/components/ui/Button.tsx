import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button className={cn('px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition', className)} {...props}>
      {children}
    </button>
  );
}