export interface Student {
  id?: string;
  nome: string;
  email: string;
  curso: string | { id: string; courseName: string };
  courseId: string;
}

export interface CreateStudentDTO {
  userId?: string | null;
  registerUser: {
    name: string;
    email: string;
    password: string;
  };
  courseId: string;
}