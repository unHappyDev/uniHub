export interface Attendance {
  id: string;
  studentId: string;
  username: string;
  subjectName: string;
  attendanceDate: string;
  presence: boolean;
  schedule?: {
    scheduleId: string;
    dayOfWeek: string;
    startAt: string;
    endAt: string;
  } | null;
}

export interface CreateAttendanceDTO {
  studentId: string;
  classroomId: string;
  scheduleId: string;
  attendanceDate: string;
  presence: boolean;
}
