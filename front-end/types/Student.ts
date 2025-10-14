// Tipo usado no front-end
export interface Student {
  id?: number;
  nome: string;
  email: string;
  curso: string; // nome do curso (exibido)
  semestre: string;
  courseId?: string; // ✅ id real do curso
}

// Tipo usado apenas para enviar/criar no backend
export interface CreateStudentDTO {
  curso: string;
  semestre: string;
  nome: string;
  email: string;
  userId?: string;
  registerUser: {
    nome: string;
    email: string;
    senha?: string;
  };
  courseId: string; // ✅ compatível com backend
}
