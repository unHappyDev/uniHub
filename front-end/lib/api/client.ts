import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const apiSpring: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});
