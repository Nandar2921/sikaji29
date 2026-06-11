'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Bookmark {
  id: number;
  verseId: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  createdAt: string;
}

interface SearchHistoryItem {
  id: number;
  keyword: string;
  createdAt: string;
}

export default function ProfileContent() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch bookmarks
      fetch('/api/bookmarks')
        .then(res => res.json())
        .then(data => {
          // Pastikan data adalah array
          if (Array.isArray(data)) {
            setBookmarks(data);
          } else {
            console.error('Bookmarks is not an array:', data);
            setBookmarks([]);
          }
        })
        .catch(err => {
          console.error('Error fetching bookmarks:', err);
          setBookmarks([]);
        });
      
      // Fetch search history
      fetch('/api/search-history')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHistory(data);
          } else {
            console.error('History is not an array:', data);
            setHistory([]);
          }
        })
        .catch(err => {
          console.error('Error fetching history:', err);
          setHistory([]);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const clearHistory = async () => {
    await fetch('/api/search-history', { method: 'DELETE' });
    setHistory([]);
  };

  if (status === 'loading' || loading) return <div className="text-center mt-10">Loading...</div>;

  if (!session) {
    return (
      <div className="text-center mt-10">
        <p>Silakan login untuk melihat profil</p>
        <Link href="/login" className="text-emerald-600 hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profil Saya</h1>
      <p className="text-gray-600 mb-6">{session.user?.email}</p>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-2 px-4 ${activeTab === 'bookmarks' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}
        >
          📖 Bookmark ({Array.isArray(bookmarks) ? bookmarks.length : 0})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}
        >
          🕐 Riwayat ({Array.isArray(history) ? history.length : 0})
        </button>
      </div>

      {/* Bookmark Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          {!Array.isArray(bookmarks) || bookmarks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada bookmark. Klik icon ⭐ di ayat favorit Anda</p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <Link
                  key={bookmark.id}
                  href={`/quran/${bookmark.surah}/${bookmark.ayah}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">QS. {bookmark.surah}:{bookmark.ayah}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{bookmark.translation}</div>
                    </div>
                    <div className="text-yellow-500">⭐</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {!Array.isArray(history) || history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada riwayat pencarian</p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearHistory}
                  className="text-red-500 text-sm hover:underline"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <Link
                    key={item.id}
                    href={`/search?q=${item.keyword}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600">🔍 {item.keyword}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}