CREATE TABLE students (
    student_id UUID PRIMARY KEY,
    course UUID NOT NULL,

    CONSTRAINT fk_student_user FOREIGN KEY (student_id) REFERENCES users(user_id),
    CONSTRAINT fk_student_course FOREIGN KEY (course) REFERENCES courses(course_id)
);

CREATE TABLE professors (
    professor_id UUID PRIMARY KEY,

    CONSTRAINT fk_student_user FOREIGN KEY (professor_id) REFERENCES users(user_id)
);

CREATE TABLE classrooms (
    classroom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor UUID,
    subject UUID NOT NULL,
    semester TEXT,
    start_at TIME,
    end_at TIME,

    CONSTRAINT fk_professor FOREIGN KEY (professor) REFERENCES professors(professor_id),
    CONSTRAINT fk_subject FOREIGN KEY (subject) REFERENCES subjects(subject_id)
);

CREATE TABLE attendances (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student UUID NOT NULL,
    classroom UUID NOT NULL,
    attendance_date TIMESTAMPTZ NOT NULL,
    presence BOOLEAN NOT NULL,

    CONSTRAINT fk_student FOREIGN KEY (student) REFERENCES students(student_id),
    CONSTRAINT fk_classroom FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id)
);

CREATE TABLE classrooms_students (
    fk_classroom_id UUID NOT NULL,
    fk_student_id UUID NOT NULL,

    PRIMARY KEY (fk_classroom_id, fk_student_id),
    CONSTRAINT fk_classroom_students_class FOREIGN KEY (fk_classroom_id) REFERENCES classrooms(classroom_id),
    CONSTRAINT fk_classroom_students_student FOREIGN KEY (fk_student_id) REFERENCES students(student_id)
);

CREATE TABLE grades (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student UUID NOT NULL,
    classroom UUID NOT NULL,
    activity TEXT,
    grade DECIMAL(5,2),

    CONSTRAINT fk_grade_student FOREIGN KEY (student) REFERENCES students(student_id),
    CONSTRAINT fk_grade_class FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id)
);