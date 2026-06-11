const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sikaji29',
  database: 'sikaji',
});

// Basmalah dalam berbagai format yang mungkin ada
const basmalahPatterns = [
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  '﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', // dengan BOM
];

async function fixBasmalah() {
  console.log('🔧 Memperbaiki data Basmalah...\n');
  
  let totalFixed = 0;
  let skippedSurah9 = 0;
  
  for (let surah = 1; surah <= 114; surah++) {
    // Surah 9 (At-Taubah) tidak memiliki Basmalah
    if (surah === 9) {
      console.log(`📖 Surah ${surah} (At-Taubah) - Skip (memang tidak pakai Basmalah)`);
      skippedSurah9++;
      continue;
    }
    
    // Ambil ayat 1 dari surah ini
    const result = await pool.query(
      'SELECT id, arabic FROM quran_verses WHERE surah = $1 AND ayah = 1',
      [surah]
    );
    
    if (result.rows.length === 0) continue;
    
    const verse = result.rows[0];
    let originalText = verse.arabic;
    let newText = originalText;
    
    // Cek dan hapus Basmalah
    for (const pattern of basmalahPatterns) {
      if (newText.includes(pattern)) {
        newText = newText.replace(pattern, '').trim();
        // Jika setelah dihapus masih ada spasi/tanda di awal
        newText = newText.replace(/^[،,،\s]+/, '');
      }
    }
    
    // Jika ada perubahan, update database
    if (newText !== originalText && newText.length > 0) {
      await pool.query(
        'UPDATE quran_verses SET arabic = $1 WHERE id = $2',
        [newText, verse.id]
      );
      console.log(`✅ Surah ${surah}: Hapus Basmalah dari ayat 1`);
      totalFixed++;
    } else if (newText.length === 0) {
      console.log(`⚠️ Surah ${surah}: Teks menjadi kosong setelah hapus Basmalah`);
    }
  }
  
  console.log('\n========================================');
  console.log('🎉 PERBAIKAN SELESAI!');
  console.log('========================================');
  console.log(`✅ Surah yang diperbaiki: ${totalFixed}`);
  console.log(`⏭️  Surah tanpa Basmalah (At-Taubah): ${skippedSurah9}`);
  console.log('========================================');
  
  // Verifikasi sample
  console.log('\n📋 Verifikasi sample:');
  const samples = await pool.query(
    `SELECT surah, ayah, LEFT(arabic, 50) as arabic_preview 
     FROM quran_verses 
     WHERE ayah = 1 AND surah IN (1, 2, 9, 112) 
     ORDER BY surah`
  );
  
  samples.rows.forEach(row => {
    console.log(`Surah ${row.surah} Ayat 1: ${row.arabic_preview}...`);
  });
  
  await pool.end();
  process.exit(0);
}

fixBasmalah().catch(console.error);