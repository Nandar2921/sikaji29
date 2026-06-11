'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Surah {
  surah: number;
  ayat_count: number;
}

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [loadingSurah, setLoadingSurah] = useState(true);
  
  // Debounce query untuk mencegah terlalu banyak request
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        const response = await fetch('/api/surah');
        const data = await response.json();
        if (Array.isArray(data)) {
          setSurahList(data);
        }
      } catch (err) {
        console.error('Failed to load surah list:', err);
      } finally {
        setLoadingSurah(false);
      }
    };
    fetchSurahList();
  }, []);

  // Auto-search when debounced query changes (optional)
  useEffect(() => {
    if (debouncedQuery && !selectedSurah) {
      router.push(`/search?q=${debouncedQuery}`);
    }
  }, [debouncedQuery, router, selectedSurah]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSurah) {
      router.push(`/search?q=surah ${selectedSurah}`);
    } 
    else if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Cari ayat, terjemahan, atau nama surah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold"
        >
          <span className="hidden sm:inline">Cari</span>
          <span className="sm:hidden">🔍</span>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <select
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">Semua Surah</option>
          {!loadingSurah && surahList.map((s) => (
            <option key={s.surah} value={s.surah}>
              {s.surah}. Surah {s.surah} ({s.ayat_count} ayat)
            </option>
          ))}
        </select>
        
        {selectedSurah && (
          <button
            type="button"
            onClick={() => setSelectedSurah('')}
            className="text-red-400 text-sm hover:text-red-600 transition"
          >
            ✕ Hapus
          </button>
        )}
      </div>
    </form>
  );
}