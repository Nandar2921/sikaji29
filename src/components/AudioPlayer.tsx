'use client';

import { useState, useRef } from 'react';

interface AudioPlayerProps {
  surah: number;
  ayah: number;
}

export default function AudioPlayer({ surah, ayah }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah}${ayah.toString().padStart(3, '0')}.mp3`;

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onloadstart = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
    >
      {isLoading ? (
        'Memuat...'
      ) : isPlaying ? (
        <>
          ⏸️ Pause
        </>
      ) : (
        <>
          🔊 Play Audio
        </>
      )}
    </button>
  );
}