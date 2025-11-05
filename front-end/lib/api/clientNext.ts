import axios, { AxiosInstance } from "axios";

export const apiNext: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

export default apiNext;
