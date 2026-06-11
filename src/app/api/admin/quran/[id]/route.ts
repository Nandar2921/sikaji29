import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quranVerses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// PUT: Update ayat berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { surah, ayah, arabic, translation } = body;

    // Validasi input
    if (!surah || !ayah || !arabic || !translation) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Cek apakah ayat ada
    const existing = await db.select().from(quranVerses).where(eq(quranVerses.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
    }

    // Update data
    const updatedVerse = await db.update(quranVerses)
      .set({
        surah: parseInt(surah),
        ayah: parseInt(ayah),
        arabic: arabic,
        translation: translation,
      })
      .where(eq(quranVerses.id, id))
      .returning();

    return NextResponse.json(updatedVerse[0]);
  } catch (error) {
    console.error('Error updating verse:', error);
    return NextResponse.json({ error: 'Failed to update verse' }, { status: 500 });
  }
}

// DELETE: Hapus ayat berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Cek apakah ayat ada
    const existing = await db.select().from(quranVerses).where(eq(quranVerses.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
    }

    // Hapus data (tafsir akan otomatis terhapus karena CASCADE)
    await db.delete(quranVerses).where(eq(quranVerses.id, id));

    return NextResponse.json({ message: 'Verse deleted successfully' });
  } catch (error) {
    console.error('Error deleting verse:', error);
    return NextResponse.json({ error: 'Failed to delete verse' }, { status: 500 });
  }
}