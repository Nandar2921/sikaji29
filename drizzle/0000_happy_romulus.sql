CREATE TABLE "quran_verses" (
	"id" serial PRIMARY KEY NOT NULL,
	"surah" integer NOT NULL,
	"ayah" integer NOT NULL,
	"arabic" text NOT NULL,
	"translation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tafsir" (
	"id" serial PRIMARY KEY NOT NULL,
	"verse_id" integer NOT NULL,
	"source" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tafsir" ADD CONSTRAINT "tafsir_verse_id_quran_verses_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."quran_verses"("id") ON DELETE cascade ON UPDATE no action;