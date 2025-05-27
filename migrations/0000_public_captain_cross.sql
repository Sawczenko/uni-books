CREATE TABLE "books" (
	"id" serial NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"isbn" text NOT NULL,
	"published_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "books_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial NOT NULL,
	"book_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "inventory_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "locations_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"inventory_id" integer NOT NULL,
	"rental_date" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "rentals_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "isbn_idx" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "username_idx" ON "user" USING btree ("username");