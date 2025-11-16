/*
  Warnings:

  - You are about to drop the column `end_at` on the `classrooms` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `classrooms` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'STUDENT';

-- AlterTable
ALTER TABLE "public"."ActivationToken" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "public"."ResetPasswordToken" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "public"."classrooms" DROP COLUMN "end_at",
DROP COLUMN "start_at";

-- AlterTable
ALTER TABLE "public"."posts" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "public"."session"
    RENAME CONSTRAINT "Session_pkey" TO "session_pkey";

ALTER TABLE "public"."session"
    ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc'),
ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone 'utc');

-- CreateTable
CREATE TABLE "public"."classroom_schedule" (
    "schedule_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "day_of_week" "public"."WeekDay" NOT NULL,
    "start_at" TIME NOT NULL,
    "end_at" TIME NOT NULL,
    "classroom_ref" UUID NOT NULL,

    CONSTRAINT "classroom_schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- RenameForeignKey
ALTER TABLE "public"."session" RENAME CONSTRAINT "Session_user_id_fkey" TO "session_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."classroom_schedule" ADD CONSTRAINT "classroom_schedule_classroomId_fkey" FOREIGN KEY ("classroom_ref") REFERENCES "public"."classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."Session_expires_at_idx" RENAME TO "session_expires_at_idx";

-- RenameIndex
ALTER INDEX "public"."Session_token_idx" RENAME TO "session_token_idx";

-- RenameIndex
ALTER INDEX "public"."Session_user_id_idx" RENAME TO "session_user_id_idx";
