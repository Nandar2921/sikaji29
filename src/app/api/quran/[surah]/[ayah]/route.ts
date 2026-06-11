import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quranVerses, tafsir } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { surah: string; ayah: string } }
) {
  try {
    const surah = parseInt(params.surah);
    const ayah = parseInt(params.ayah);
    
    // Cari ayat
    const verse = await db.select()
      .from(quranVerses)
      .where(and(eq(quranVerses.surah, surah), eq(quranVerses.ayah, ayah)))
      .limit(1);
    
    if (verse.length === 0) {
      return NextResponse.json({ error: 'Ayat not found' }, { status: 404 });
    }
    
    // Cari tafsir untuk ayat ini
    const tafsirList = await db.select()
      .from(tafsir)
      .where(eq(tafsir.verseId, verse[0].id));
    
    // Cari next ayat
    const nextVerse = await db.select({
      surah: quranVerses.surah,
      ayah: quranVerses.ayah
    })
    .from(quranVerses)
    .where(
      sql`(surah = ${surah} AND ayah > ${ayah}) OR surah > ${surah}`
    )
    .orderBy(quranVerses.surah, quranVerses.ayah)
    .limit(1);
    
    // Cari previous ayat
    const prevVerse = await db.select({
      surah: quranVerses.surah,
      ayah: quranVerses.ayah
    })
    .from(quranVerses)
    .where(
      sql`(surah = ${surah} AND ayah < ${ayah}) OR surah < ${surah}`
    )
    .orderBy(sql`${quranVerses.surah} DESC, ${quranVerses.ayah} DESC`)
    .limit(1);
    
    return NextResponse.json({
      verse: verse[0],
      tafsir: tafsirList,
      navigation: {
        next: nextVerse.length > 0 ? nextVerse[0] : null,
        prev: prevVerse.length > 0 ? prevVerse[0] : null
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}