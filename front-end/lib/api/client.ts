import axios, { AxiosInstance } from "axios";

export const apiSpring: AxiosInstance = axios.create({
  baseURL: "/api", // ✅ conecta direto ao backend Spring Boot
  withCredentials: true,
});

const attachToken = (config: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

apiSpring.interceptors.request.use(attachToken, (error) => Promise.reject(error));

export default apiSpring;
