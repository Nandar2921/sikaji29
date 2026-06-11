import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { quranVerses } from '../src/lib/db/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const verses = [
  { surah: 1, ayah: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang' },
  { surah: 1, ayah: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Segala puji bagi Allah, Tuhan seluruh alam' },
  { surah: 1, ayah: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Yang Maha Pengasih, Maha Penyayang' },
  { surah: 1, ayah: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Pemilik hari pembalasan' },
  { surah: 2, ayah: 255, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah, tidak ada tuhan selain Dia. Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya)' },
  { surah: 2, ayah: 286, arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya' },
];

async function seed() {
  console.log('🌱 Seeding Quran verses...');
  try {
    for (const v of verses) {
      await db.insert(quranVerses).values(v);
      console.log(`✅ Inserted QS. ${v.surah}:${v.ayah}`);
    }
    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();