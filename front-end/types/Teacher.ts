export interface Teacher {
  id: string;
  nome: string;
  email: string;
}

export interface CreateTeacherDTO {
  registerUser: {
    name: string;
    email: string;
    password: string;
    role: string; 
  };
}
