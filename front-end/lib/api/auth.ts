import { AxiosError } from "axios";
import apiClient from "./client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface SessionInfo {
  user: {
    username: string;
    email: string;
    role: string;
  };
  session: {
    id: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
  };
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
  const defaultErrorResponse = {
    message: "Something went wrong. Please try again later.",
    action: "If the problem persists, contact support.",
  };
  return error.response?.data?.error ?? defaultErrorResponse;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post("/v1/login", credentials),

  logout: () => apiClient.delete("/v1/logout"),

  register: (userData: RegisterData) =>
    apiClient.post("/v1/register", userData),

  activate: (token: string) => apiClient.get(`/v1/activate?token=${token}`),

  verifySession: () => apiClient.get<SessionInfo>("/v1/verify-session"),

  forgotPassword: (email: string) =>
    apiClient.post("/v1/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/v1/reset-password", { token, password }),

  resendActivationByToken: (token: string) =>
    apiClient.post("/v1/resend-activation", { token }),

  resendActivationByEmail: (email: string) =>
    apiClient.post("/v1/resend-activation", { email }),
};
