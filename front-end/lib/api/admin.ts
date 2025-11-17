import apiSpring from "./clientSpring";


export const getAdmins = async () => {
  const res = await apiSpring.get("/user");
  return res.data;
};

export const createAdmin = async (dto: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await apiSpring.post("/user", dto);
  return res.data;
};

export const updateAdmin = async (id: string, dto: any) => {
  const res = await apiSpring.put(`/user/${id}`, dto);
  return res.data;
};

export const deleteAdmin = async (id: string) => {
  const res = await apiSpring.delete(`/user/${id}`);
  return res.data;
};
