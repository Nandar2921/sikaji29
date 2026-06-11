import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full border border-gray-300 rounded-md px-3 py-2', props.className)} {...props} />;
}