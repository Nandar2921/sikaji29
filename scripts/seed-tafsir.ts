import 'dotenv/config';
import { db } from '../src/lib/db';
import { tafsir, quranVerses } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

const tafsirData = [
  { 
    verseId: 5, 
    source: 'Ibnu Katsir', 
    content: 'Ayat Kursi adalah ayat paling agung dalam Al-Quran. Mengandung nama-nama Allah yang indah dan sifat-sifat-Nya yang sempurna. Barangsiapa membacanya di malam hari, akan senantiasa dijaga oleh Allah.' 
  },
  { 
    verseId: 5, 
    source: 'Al-Jalalain', 
    content: 'Allah tidak ada tuhan selain Dia, Yang Maha Hidup lagi Maha Mandiri. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi.' 
  },
  { 
    verseId: 1, 
    source: 'Ibnu Katsir', 
    content: 'Surat Al-Fatihah adalah Ummul Quran (induk Al-Quran), surat yang paling agung. Wajib dibaca dalam setiap rakaat shalat.' 
  },
  { 
    verseId: 2, 
    source: 'Ibnu Katsir', 
    content: 'Segala puji bagi Allah, pujian yang sempurna atas semua nikmat-Nya. Allah-lah Tuhan semesta alam, Pencipta dan Pengatur seluruh makhluk.' 
  },
];

async function seed() {
  console.log('🌱 Seeding Tafsir...');
  
  try {
    // Cek dulu apakah tabel quran_verses ada isinya
    const verses = await db.select().from(quranVerses);
    console.log(`📖 Found ${verses.length} Quran verses in database`);
    
    if (verses.length === 0) {
      console.log('❌ No Quran verses found! Please run seed-quran.ts first.');
      process.exit(1);
    }
    
    // Insert tafsir
    for (const t of tafsirData) {
      // Cek apakah verse_id valid
      const verseExists = verses.find(v => v.id === t.verseId);
      if (verseExists) {
        await db.insert(tafsir).values({
          verseId: t.verseId,
          source: t.source,
          content: t.content,
        });
        console.log(`✅ Inserted tafsir for verse ID ${t.verseId} (QS. ${verseExists.surah}:${verseExists.ayah}) from ${t.source}`);
      } else {
        console.log(`⚠️  Verse ID ${t.verseId} not found, skipping...`);
      }
    }
    
    console.log('✅ Tafsir seeding completed!');
    
    // Tampilkan hasil
    const result = await db.select().from(tafsir);
    console.log(`\n📊 Total tafsir entries: ${result.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding tafsir:', error);
  }
  
  process.exit(0);
}

seed();