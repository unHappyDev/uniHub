import { AxiosError } from "axios";
import { apiSpring } from "./client"; // ⬅️ usa a API do Spring

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
    message: "Something went wrong. Please try again later.",
    action: "If the problem persists, contact support.",
  };
  return error.response?.data?.error ?? defaultErrorResponse;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiSpring.post<LoginResponse>("/v1/login", credentials);
    return res.data;
  },

  logout: () => apiSpring.delete("/v1/logout"),
  register: (userData: any) => apiSpring.post("/v1/register", userData),
  activate: (token: string) => apiSpring.get(`/v1/activate?token=${token}`),
  verifySession: () => apiSpring.get("/v1/verify-session"),
  forgotPassword: (email: string) =>
    apiSpring.post("/v1/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    apiSpring.post("/v1/reset-password", { token, password }),
  resendActivationByToken: (token: string) =>
    apiSpring.post("/v1/resend-activation", { token }),
  resendActivationByEmail: (email: string) =>
    apiSpring.post("/v1/resend-activation", { email }),
};
