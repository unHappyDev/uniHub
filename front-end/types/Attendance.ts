export interface Attendance {
  id: string;
  studentId: string;
  username: string;
  classroomId: string;
  subjectName: string;
  schedule: {
    scheduleId: string;
    dayOfWeek: string;
    startAt: string;
    endAt: string;
  } | null;
  attendanceDate: string;
  presence: boolean;
}

export interface CreateAttendanceDTO {
  studentId: string;
  classroomId: string;
  scheduleId: string;
  attendanceDate: string;
  presence: boolean;
}

export interface StudentsAttendanceDTO {
  studentId: string;
  username: string;
  classroomId: string;
  subjectName: string;
  numAbsences: number;
}
