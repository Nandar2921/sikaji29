import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { db } from '@/lib/db';
import { bookmarks, quranVerses } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session?.user);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    
    const userBookmarks = await db
      .select({
        id: bookmarks.id,
        verseId: bookmarks.verseId,
        surah: quranVerses.surah,
        ayah: quranVerses.ayah,
        arabic: quranVerses.arabic,
        translation: quranVerses.translation,
        createdAt: bookmarks.createdAt,
      })
      .from(bookmarks)
      .leftJoin(quranVerses, eq(bookmarks.verseId, quranVerses.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json(userBookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { verseId } = await request.json();
    
    const existing = await db.select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.verseId, verseId)
        )
      );
    
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Bookmark already exists' }, { status: 400 });
    }
    
    const newBookmark = await db.insert(bookmarks).values({
      userId: userId,
      verseId: verseId,
    }).returning();
    
    return NextResponse.json(newBookmark[0], { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { verseId } = await request.json();
    
    await db.delete(bookmarks).where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.verseId, verseId)
      )
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}