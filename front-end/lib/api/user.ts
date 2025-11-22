import apiSpring from "@/lib/api/clientSpring";

export async function getLoggedUser() {
  const response = await apiSpring.get("/user/logged");
  return response.data;
}

export async function updateUser(id: string, data: any) {
  const response = await apiSpring.put(`/user/${id}`, data);
  return response.data;
}