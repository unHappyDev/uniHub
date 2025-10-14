import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const apiSpring: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Interceptor: adiciona o token JWT em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;