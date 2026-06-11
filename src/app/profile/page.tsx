'use client';

import { SessionProvider } from 'next-auth/react';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  );
}