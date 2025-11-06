import { AxiosError } from "axios";
import apiNext from "./clientNext"; // ✅ login vai para Next.js

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  token: string;
  role: "admin" | "professor" | "user";
}

interface ErrorData {
  message: string;
  action: string;
}

interface ErrorResponse {
  error: ErrorData;
}

export function getErrorObject(e: unknown): ErrorData {
  const error = e as AxiosError<ErrorResponse>;
  const defaultErrorResponse: ErrorData = {
    message: "Algo deu errado. Tente novamente mais tarde.",
    action: "Se o problema persistir, contate o suporte.",
  };
  return error.response?.data?.error ?? defaultErrorResponse;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiNext.post<LoginResponse>("/login", credentials);
    return res.data;
  },

  logout: () => apiNext.delete("/logout"),
  register: (userData: any) => apiNext.post("/register", userData),
  verifySession: () => apiNext.get("/verify-session"),
};
