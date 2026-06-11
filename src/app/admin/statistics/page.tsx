'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminStatisticsPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ verses: 0, users: 0, tafsir: 0 });

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      // Fetch statistics
      fetch('/api/admin/quran')
        .then(res => res.json())
        .then(data => setStats(prev => ({ ...prev, verses: data.length })));
      
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => setStats(prev => ({ ...prev, users: data.length })))
        .catch(() => setStats(prev => ({ ...prev, users: 0 })));
      
      fetch('/api/admin/tafsir')
        .then(res => res.json())
        .then(data => setStats(prev => ({ ...prev, tafsir: data.length })))
        .catch(() => setStats(prev => ({ ...prev, tafsir: 0 })));
    }
  }, [session]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'admin') return <div>Access Denied</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statistik Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">{stats.verses}</div>
          <div className="text-gray-600">Total Ayat Quran</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">{stats.tafsir}</div>
          <div className="text-gray-600">Total Tafsir</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">{stats.users}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
      </div>
      <Link href="/admin" className="text-emerald-600 hover:underline mt-4 inline-block">
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}