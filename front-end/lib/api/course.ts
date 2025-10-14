import { apiSpring } from "./client";

export const getCourses = async () => {
  const response = await apiSpring.get("/course");
  return response.data;
};
