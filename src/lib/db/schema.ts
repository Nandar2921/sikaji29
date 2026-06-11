import { pgTable, serial, integer, text, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
export const searchHistory = pgTable('search_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keyword: varchar('keyword', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quranVerses = pgTable('quran_verses', {
  id: serial('id').primaryKey(),
  surah: integer('surah').notNull(),
  ayah: integer('ayah').notNull(),
  arabic: text('arabic').notNull(),
  translation: text('translation').notNull(),
  surahName: varchar('surah_name', { length: 100 }),
}, (table) => ({
  uniqueSurahAyah: unique().on(table.surah, table.ayah),
}));

export const tafsir = pgTable('tafsir', {
  id: serial('id').primaryKey(),
  verseId: integer('verse_id').notNull().references(() => quranVerses.id, { onDelete: 'cascade' }),
  source: varchar('source', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// TAMBAHKAN TABEL BOOKMARKS
export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  verseId: integer('verse_id').notNull().references(() => quranVerses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueUserVerse: unique().on(table.userId, table.verseId),
}));