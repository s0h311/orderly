DO $$ BEGIN
 CREATE TYPE "public"."payment_period" AS ENUM('monthly', 'yearly', 'lifetime');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_type" AS ENUM('free', 'premium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_ad" timestamp (2) with time zone DEFAULT now() NOT NULL,
	"last_payment_at" timestamp (2) with time zone,
	"type" "subscription_type" NOT NULL,
	"payment_period" "payment_period" NOT NULL
);
