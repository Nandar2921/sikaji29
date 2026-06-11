'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Verse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
}

export default function SurahDetailPage() {
  const params = useParams();
  const surahId = params.id;
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [surahName, setSurahName] = useState('');

  useEffect(() => {
    if (surahId) {
      // Fetch semua ayat dari surah ini
      fetch(`/api/search?q=surah ${surahId}`)
        .then(res => res.json())
        .then(data => {
          setVerses(data.results || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setLoading(false);
        });
    }
  }, [surahId]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/surah" className="text-emerald-600 hover:underline mb-4 inline-block">
        ← Kembali ke Daftar Surah
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Surah {surahId}</h1>
      
      <div className="space-y-4">
        {verses.map((verse) => (
          <Link href={`/quran/${verse.surah}/${verse.ayah}`} key={verse.id}>
            <div className="p-4 border rounded-md hover:shadow-lg transition cursor-pointer">
              <div className="text-right text-xl font-arabic mb-2">
                {verse.arabic}
              </div>
              <div className="italic mt-2">
                {verse.translation}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Ayat {verse.ayah}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}