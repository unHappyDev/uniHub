import axios from "axios";

export const apiSpring = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default apiSpring;