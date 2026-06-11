import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quranVerses } from '@/lib/db/schema';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }
  const sampleVerses = [
    { surah: 1, ayah: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang' },
    { surah: 1, ayah: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Segala puji bagi Allah, Tuhan seluruh alam' },
    { surah: 2, ayah: 255, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah, tidak ada tuhan selain Dia. Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya)' },
  ];
  for (const v of sampleVerses) {
    await db.insert(quranVerses).values(v);
  }
  return NextResponse.json({ message: 'Seeded 3 verses' });
}