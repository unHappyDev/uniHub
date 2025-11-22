-- AlterTable
ALTER TABLE "ActivationToken" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "ResetPasswordToken" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT (now() at time zone 'utc');

-- CreateTable
CREATE TABLE "posts" (
    "post_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT (now() at time zone 'utc'),
    "owner" UUID NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject_name" TEXT NOT NULL,
    "workload_hours" INTEGER NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "course_name" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "courses_subjects" (
    "fk_course_id" UUID NOT NULL,
    "fk_subject_id" UUID NOT NULL,

    CONSTRAINT "courses_subjects_pkey" PRIMARY KEY ("fk_course_id","fk_subject_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" UUID NOT NULL,
    "course" UUID NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "professors" (
    "professor_id" UUID NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("professor_id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "classroom_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "professor" UUID NOT NULL,
    "subject" UUID NOT NULL,
    "semester" TEXT,
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("classroom_id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "attendance_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student" UUID NOT NULL,
    "classroom" UUID NOT NULL,
    "attendance_date" TIMESTAMPTZ(6) NOT NULL,
    "presence" BOOLEAN NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "classrooms_students" (
    "fk_classroom_id" UUID NOT NULL,
    "fk_student_id" UUID NOT NULL,

    CONSTRAINT "classrooms_students_pkey" PRIMARY KEY ("fk_classroom_id","fk_student_id")
);

-- CreateTable
CREATE TABLE "grades" (
    "grade_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student" UUID NOT NULL,
    "classroom" UUID NOT NULL,
    "activity" TEXT,
    "grade" DECIMAL(5,2),

    CONSTRAINT "grades_pkey" PRIMARY KEY ("grade_id")
);

-- CreateIndex
CREATE INDEX "posts_owner_idx" ON "posts"("owner");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_subjects" ADD CONSTRAINT "courses_subjects_fk_course_id_fkey" FOREIGN KEY ("fk_course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_subjects" ADD CONSTRAINT "courses_subjects_fk_subject_id_fkey" FOREIGN KEY ("fk_subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_fkey" FOREIGN KEY ("course") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_professor_fkey" FOREIGN KEY ("professor") REFERENCES "professors"("professor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_subject_fkey" FOREIGN KEY ("subject") REFERENCES "subjects"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_fkey" FOREIGN KEY ("student") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_classroom_fkey" FOREIGN KEY ("classroom") REFERENCES "classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms_students" ADD CONSTRAINT "classrooms_students_fk_classroom_id_fkey" FOREIGN KEY ("fk_classroom_id") REFERENCES "classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms_students" ADD CONSTRAINT "classrooms_students_fk_student_id_fkey" FOREIGN KEY ("fk_student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_fkey" FOREIGN KEY ("student") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_classroom_fkey" FOREIGN KEY ("classroom") REFERENCES "classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;
