'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import SkeletonSearch from '@/components/ui/skeleton/SkeletonSearch';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { useSession } from 'next-auth/react';

interface Verse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
}

interface SurahInfo {
  number: number;
  latin: string;
  arabic: string;
  meaning: string;
  displayName: string;
}

interface SearchResult {
  results: Verse[];
  total: number;
  page: number;
  totalPages: number;
  keyword: string;
  isSurahSearch?: boolean;
  matchedSurah?: number;
  surahInfo?: SurahInfo;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // TAMBAHKAN STATE ERROR
  const { data: session } = useSession();

  useEffect(() => {
    if (!q) {
      setLoading(false);
      setError(null); // Reset error
      return;
    }
    
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    const params = new URLSearchParams();
    params.set('q', q);
    params.set('page', currentPage.toString());
    
    fetch(`/api/search?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error('Search error:', err);
        setError(err.message || 'Terjadi kesalahan saat mencari. Silakan coba lagi.');
      })
      .finally(() => setLoading(false));
  }, [q, currentPage]);


useEffect(() => {
    if (q && !loading && data && session) {
      fetch('/api/search-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: q }),
      }).catch(console.error);
    }
  }, [q, loading, data, session]);


  // Handle error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorAlert 
          message={error} 
          onRetry={() => {
            setError(null);
            setLoading(true);
            // Trigger refetch
            const params = new URLSearchParams();
            params.set('q', q!);
            params.set('page', currentPage.toString());
            fetch(`/api/search?${params.toString()}`)
              .then(res => res.json())
              .then(setData)
              .catch((err) => setError(err.message))
              .finally(() => setLoading(false));
          }}
        />
      </div>
    );
  }

  // Jika belum ada query, tampilkan form pencarian
  if (!q) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Pencarian Quran</h1>
        <SearchForm />
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">💡 Tips Pencarian:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cari kata: <strong>"Allah"</strong>, <strong>"Rahman"</strong>, <strong>"Shalat"</strong></li>
            <li>• Cari surah: <strong>"Yasin"</strong>, <strong>"Al-Fatihah"</strong>, <strong>"Ar-Rahman"</strong></li>
            <li>• Gunakan format: <strong>"surah 1"</strong>, <strong>"qs 36"</strong>, <strong>"surat 112"</strong></li>
          </ul>
        </div>
      </div>
    );
  }

  if (loading) return <SkeletonSearch />;

  if (!data || data.results.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>Tidak ditemukan ayat yang cocok dengan kata kunci "{q}".</p>
        <Link href="/search" className="text-emerald-600 hover:underline mt-4 inline-block">
          ← Kembali ke Pencarian
        </Link>
      </div>
    );
  }

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.split(regex).map((part: string, i: number) => 
      part.toLowerCase() === keyword.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 text-black">{part}</mark> : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/search" className="text-emerald-600 hover:underline text-sm mb-4 inline-block">
          ← Pencarian Baru
        </Link>
        
        <h1 className="text-2xl font-bold mb-2">Hasil pencarian: "{q}"</h1>
        
        {data.isSurahSearch && data.matchedSurah && data.surahInfo && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-arabic text-emerald-800">
                {data.surahInfo.arabic}
              </div>
              <div>
                <div className="font-bold text-xl text-emerald-800">
                  {data.surahInfo.displayName}
                </div>
                <div className="text-sm text-emerald-600">
                  Surah ke-{data.surahInfo.number} | {data.total} ayat
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  {data.surahInfo.meaning}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500">Ditemukan {data.total} ayat</p>
      </div>
      
      <div className="space-y-4">
        {data.results.map((verse: Verse) => {
          // Cek apakah ini ayat pertama dalam surah (bukan surah 9)
          const isFirstAyah = verse.ayah === 1;
          const showBasmalah = isFirstAyah && verse.surah !== 9;
          
          return (
            <Link href={`/quran/${verse.surah}/${verse.ayah}`} key={verse.id}>
              <div className="p-5 border rounded-xl hover:shadow-lg transition cursor-pointer hover:bg-gray-50 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Ayat {verse.ayah}
                  </span>
                </div>
                
                {/* Tambahan Basmalah untuk ayat pertama setiap surah (kecuali surah 9) */}
                {showBasmalah && (
                  <div className="text-center mb-4 pb-3 border-b border-gray-100">
                    <div className="text-2xl font-arabic text-emerald-600 mb-1">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                    <div className="text-xs text-gray-400 italic">
                      "Dengan menyebut nama Allah Yang Maha Pengasih, Maha Penyayang"
                    </div>
                  </div>
                )}
                
                <div className="text-right text-2xl font-arabic mb-4 leading-loose">
                  {verse.arabic}
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {highlightText(verse.translation, data.isSurahSearch ? '' : q)}
                </div>
                <div className="text-xs text-gray-400 mt-3">
                  QS. {verse.surah}:{verse.ayah}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Link
            href={`/search?q=${q}&page=${currentPage - 1}`}
            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'}`}
          >
            ← Sebelumnya
          </Link>
          <span className="px-4 py-2 text-gray-600">
            Halaman {data.page} dari {data.totalPages}
          </span>
          <Link
            href={`/search?q=${q}&page=${currentPage + 1}`}
            className={`px-4 py-2 border rounded-md ${currentPage === data.totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'}`}
          >
            Selanjutnya →
          </Link>
        </div>
      )}
    </div>
  );
}