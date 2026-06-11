'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Tafsir {
  id: number;
  verseId: number;
  source: string;
  content: string;
  createdAt: string;
  surah?: number;
  ayah?: number;
}

export default function AdminTafsirPage() {
  const { data: session, status } = useSession();
  const [tafsirList, setTafsirList] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetch('/api/admin/tafsir')
        .then(res => res.json())
        .then(data => {
          setTafsirList(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) return <div className="p-6">Loading...</div>;
  if (session?.user?.role !== 'admin') return <div className="p-6 text-red-600">Access Denied</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Manajemen Tafsir</h1>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">ℹ️ Informasi</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Fitur manajemen tafsir lengkap sedang dalam pengembangan. Saat ini data tafsir dapat ditambahkan melalui database langsung.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-3">📖 Sumber Tafsir Tersedia:</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Ibnu Katsir - Tersedia</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-600">⏳</span>
            <span>Al-Jalalain - Coming Soon</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-600">⏳</span>
            <span>Al-Muyassar - Coming Soon</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-600">⏳</span>
            <span>Tafsir Ringkas Kemenag - Coming Soon</span>
          </li>
        </ul>
      </div>
      
      {tafsirList.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-3">📊 Statistik Tafsir Saat Ini:</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <p className="text-gray-600 dark:text-gray-400">Total entri tafsir: <strong>{tafsirList.length}</strong></p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Sumber: Ibnu Katsir ({tafsirList.filter(t => t.source === 'Ibnu Katsir').length} entri)
            </p>
          </div>
        </div>
      )}
      
      <Link href="/admin" className="text-emerald-600 hover:underline mt-4 inline-block">
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}