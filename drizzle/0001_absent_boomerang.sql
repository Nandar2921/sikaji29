CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"verse_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bookmarks_user_id_verse_id_unique" UNIQUE("user_id","verse_id")
);
--> statement-breakpoint
ALTER TABLE "quran_verses" ADD COLUMN "surah_name" varchar(100);--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_verse_id_quran_verses_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."quran_verses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_verses" ADD CONSTRAINT "quran_verses_surah_ayah_unique" UNIQUE("surah","ayah");