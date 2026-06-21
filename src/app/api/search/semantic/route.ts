import { NextResponse } from 'next/server';
import { pool } from '@/lib/pg';

// ✅ PAKAI ENV VAR
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || 'http://localhost:8000';
const isProduction = process.env.NODE_ENV === 'production';

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${EMBEDDING_API_URL}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error(`Embedding service error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error('Invalid embedding response');
    }
    
    return data.embedding;
  } catch (error) {
    console.error('❌ Error getting embedding:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const threshold = parseFloat(searchParams.get('threshold') || '0.3');

  // ✅ Validasi
  if (!q || q.length < 2) {
    return NextResponse.json({ 
      query: q, 
      results: [], 
      error: 'Query too short (minimum 2 characters)' 
    });
  }

  // ✅ Di production, semantic search harus diaktifkan dengan env var
  if (isProduction && !process.env.EMBEDDING_API_URL) {
    return NextResponse.json(
      { 
        error: 'Semantic search is not configured in production',
        results: [] 
      },
      { status: 503 }
    );
  }

  try {
    // 1. Dapatkan embedding
    const queryEmbedding = await getEmbedding(q);
    const vectorStr = `[${queryEmbedding.join(',')}]`;

    console.log('✅ Embedding received, length:', queryEmbedding.length);

    // 2. Cari similarity di database (Quran)
    const quranResult = await pool.query(`
      SELECT 
        'quran' as type,
        id, 
        surah, 
        ayah, 
        arabic, 
        translation,
        CONCAT('QS. ', surah, ':', ayah) as reference,
        'Al-Quran' as category,
        NULL as content,
        NULL as narrator,
        NULL as grade,
        (1 - (embedding <=> $1::vector)) as similarity
      FROM quran_verses
      WHERE embedding IS NOT NULL 
        AND (1 - (embedding <=> $1::vector)) > $2
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `, [vectorStr, threshold, limit]);

    // 3. Cari similarity di Hadits (jika ada embedding)
    const hadithResult = await pool.query(`
      SELECT 
        'hadith' as type,
        h.id, 
        NULL as surah, 
        h.number as ayah, 
        h.arabic, 
        COALESCE(ht.text, h.translation) as translation,
        h.narrator, 
        COALESCE(hg.reference, h.reference) as reference,
        'Hadits' as category,
        NULL as content,
        COALESCE(hg.grade, h.grade) as grade,
        NULL as similarity
      FROM hadiths h
      LEFT JOIN hadith_translations ht ON h.id = ht.hadith_id AND ht.language = 'id'
      LEFT JOIN hadith_gradings hg ON h.id = hg.hadith_id
      WHERE 
        h.arabic ILIKE $1 OR 
        ht.text ILIKE $1 OR
        h.translation ILIKE $1
      LIMIT $2
    `, [`%${q}%`, limit]);

    // 4. Gabungkan hasil
    const allResults = [...quranResult.rows, ...hadithResult.rows];

    // 5. Ranking berdasarkan similarity
    const ranked = allResults.map(item => {
      let score = 0;
      if (item.similarity) {
        score += item.similarity * 10;
      }
      if (item.type === 'quran') {
        score += 2;
      }
      return { ...item, _score: score };
    });

    ranked.sort((a, b) => (b._score || 0) - (a._score || 0));
    const finalResults = ranked.map(({ _score, ...item }) => item);

    return NextResponse.json({
      query: q,
      results: finalResults.slice(0, limit),
      total: finalResults.length,
      semanticUsed: true,
      threshold: threshold,
    });

  } catch (error) {
    console.error('❌ Semantic search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Semantic search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        query: q,
        semanticUsed: false,
      },
      { status: 500 }
    );
  }
}