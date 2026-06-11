'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'admin') return <div>Access Denied</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Users</h1>
      <p className="text-gray-600">Fitur manajemen users akan hadir di Milestone 3.</p>
      <Link href="/admin" className="text-emerald-600 hover:underline mt-4 inline-block">
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}