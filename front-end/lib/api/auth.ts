import { AxiosError } from "axios";
import apiClient from "./client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
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
  // login ajustado para retornar { token, role }
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/v1/login", credentials);
    return res.data;
  },

  logout: () => apiClient.delete("/v1/logout"),

  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => apiClient.post("/v1/register", userData),

  activate: (token: string) =>
    apiClient.get(`/v1/activate?token=${token}`),

  verifySession: () => apiClient.get("/v1/verify-session"),

  forgotPassword: (email: string) =>
    apiClient.post("/v1/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/v1/reset-password", { token, password }),

  resendActivationByToken: (token: string) =>
    apiClient.post("/v1/resend-activation", { token }),

  resendActivationByEmail: (email: string) =>
    apiClient.post("/v1/resend-activation", { email }),
};
