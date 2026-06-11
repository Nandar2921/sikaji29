const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sikaji29',
  database: 'sikaji',
});

async function importCorrect() {
  console.log('========================================');
  console.log('📥 IMPORT QURAN DENGAN TEKS ARAB');
  console.log('========================================\n');
  
  let totalAyat = 0;
  
  for (let surah = 1; surah <= 114; surah++) {
    process.stdout.write(`Surah ${surah}/114... `);
    
    try {
      // API 1: Untuk teks Arab
      const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`);
      const arabicData = await arabicResponse.json();
      
      // API 2: Untuk terjemahan Indonesia
      const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/id.indonesian`);
      const translationData = await translationResponse.json();
      
      if (!arabicData.data?.ayahs || !translationData.data?.ayahs) {
        console.log('❌ Gagal ambil data');
        continue;
      }
      
      const arabicAyahs = arabicData.data.ayahs;
      const translationAyahs = translationData.data.ayahs;
      
      let surahCount = 0;
      
      for (let i = 0; i < arabicAyahs.length; i++) {
        const arabicAyah = arabicAyahs[i];
        const translationAyah = translationAyahs[i];
        
        const ayahNumber = arabicAyah.numberInSurah;
        const arabicText = arabicAyah.text;
        const translationText = translationAyah.text;
        
        if (!arabicText || !translationText) {
          continue;
        }
        
        try {
          await pool.query(
            `INSERT INTO quran_verses (surah, ayah, arabic, translation) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (surah, ayah) DO UPDATE SET 
             arabic = EXCLUDED.arabic, 
             translation = EXCLUDED.translation`,
            [surah, ayahNumber, arabicText, translationText]
          );
          surahCount++;
          totalAyat++;
        } catch (err) {
          if (err.code !== '23505') {
            console.log(`\n⚠️ Error: ${err.message}`);
          }
        }
      }
      
      console.log(`✅ +${surahCount} (Total: ${totalAyat})`);
      
      // Jeda
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n========================================');
  console.log('🎉 IMPORT SELESAI!');
  console.log('========================================');
  console.log(`📊 Total ayat terimport: ${totalAyat}`);
  
  const result = await pool.query('SELECT COUNT(*) FROM quran_verses');
  console.log(`📚 Total di database: ${result.rows[0].count} ayat`);
  
  // Tampilkan sample
  const sample = await pool.query('SELECT surah, ayah, arabic, translation FROM quran_verses LIMIT 3');
  console.log('\n📋 Sample:');
  sample.rows.forEach(row => {
    console.log(`QS. ${row.surah}:${row.ayah}`);
    console.log(`Arab: ${row.arabic.substring(0, 50)}...`);
    console.log(`Artinya: ${row.translation.substring(0, 50)}...\n`);
  });
  
  await pool.end();
  process.exit(0);
}

importCorrect().catch(console.error);