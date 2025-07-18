CREATE Table subjects(
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_name TEXT NOT NULL,
    workload_hours INT
);

CREATE Table courses(
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT
);

CREATE Table courses_subjects(

    fk_course_id UUID NOT NULL,
    fk_subject_id UUID NOT NULL,

    PRIMARY KEY (fk_course_id, fk_subject_id),
    Foreign Key (fk_course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    Foreign Key (fk_subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE

);