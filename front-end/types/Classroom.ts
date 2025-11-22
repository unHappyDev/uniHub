export interface ClassroomSchedule {
  id: string;   
  weekDay: string;
  startTime: string;
  endTime: string;
  subjectName: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  courseName: string;
}

export interface Classroom {
  classroomId: string;
  professor: string;
  subject: string;
  semester: string;
  schedules: ClassroomSchedule[];
  students: ClassroomStudent[];
}

export interface CreateClassroomDTO {
  professorId: string;
  subjectId: string;
  semester: string;
  schedules: ClassroomSchedule[];
  studentsIds: string[];
}
