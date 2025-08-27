/*
  Warnings:

  - The values [USER,ADMIN,MODERATOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum with safe value migration
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('DIRECTOR', 'MANAGER', 'CUSTOMER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
-- cast to text first to allow value mapping
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE text USING "role"::text;
-- map old values to new ones
UPDATE "public"."users"
SET "role" = CASE "role"
  WHEN 'ADMIN' THEN 'DIRECTOR'
  WHEN 'USER' THEN 'CUSTOMER'
  WHEN 'MODERATOR' THEN 'MANAGER'
  ELSE "role"
END;
-- rename old type and apply new enum
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."Role_new" USING "role"::"public"."Role_new";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;
