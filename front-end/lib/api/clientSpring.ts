import axios from "axios";

export const apiSpring = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default apiSpring;