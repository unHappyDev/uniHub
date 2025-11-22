export interface Admin {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export interface CreateAdminDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}