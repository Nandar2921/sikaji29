'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface BookmarkButtonProps {
  verseId: number;
}

export default function BookmarkButton({ verseId }: BookmarkButtonProps) {
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      checkBookmark();
    }
  }, [status, verseId]);

  const checkBookmark = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      const bookmarks = await res.json();
      if (Array.isArray(bookmarks)) {
        setIsBookmarked(bookmarks.some((b: any) => b.verseId === verseId));
      }
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    if (status !== 'authenticated') {
      alert('Silakan login untuk menyimpan bookmark');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verseId }),
        });
        setIsBookmarked(false);
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verseId }),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  // Jangan tampilkan tombol jika sedang loading session
  if (status === 'loading') {
    return (
      <button className="p-2 rounded-full text-gray-300" disabled>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded-full transition ${
        isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
      }`}
    >
      <svg className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}