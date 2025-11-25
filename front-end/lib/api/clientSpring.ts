import axios from "axios";

export const apiSpring = axios.create({
  baseURL: "http://18.188.33.134:8080",
  withCredentials: true,
});

export default apiSpring;