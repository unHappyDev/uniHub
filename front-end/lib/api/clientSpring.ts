import axios, { AxiosInstance } from "axios";

export const apiSpring: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080", // chama diretamente o backend Spring Boot
  withCredentials: true,
});

apiSpring.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

export default apiSpring;
