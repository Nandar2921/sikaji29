import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Ambil daftar surah unik dari database
    const result = await db.execute(sql`
      SELECT DISTINCT surah, 
        COUNT(*) as ayat_count
      FROM quran_verses 
      GROUP BY surah 
      ORDER BY surah
    `);
    
    // Pastikan mengembalikan array (result.rows)
    const surahList = result.rows || [];
    
    return NextResponse.json(surahList);
  } catch (error) {
    console.error('Error fetching surah list:', error);
    // Return array kosong jika error
    return NextResponse.json([]);
  }
}