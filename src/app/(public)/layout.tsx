'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">{children}</main>
    </SessionProvider>
  );
}