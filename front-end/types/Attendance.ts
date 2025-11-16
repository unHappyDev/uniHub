export interface Attendance {
  id: string;
  username: string;
  subjectName: string;
  attendanceDate: string;
  presence: boolean;
}

export interface CreateAttendanceDTO {
  studentId: string;
  classroomId: string;
  attendanceDate: string;
  presence: boolean;
}
