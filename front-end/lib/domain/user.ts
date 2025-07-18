import prisma from "@lib/prisma";

async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  return user;
}

async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

async function getUserByUsername(username: string) {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  return user;
}

async function activateUserById(id: string) {
  const user = await prisma.user.update({
    where: { id: id },
    data: { is_active: true },
  });
  return user;
}

async function createUser(username: string, email: string, password: string) {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
      role: "USER",
    },
  });
  return user;
}

async function deleteUsersNotActivatedForMoreThanOneDay() {
  return await prisma.user.deleteMany({
    where: {
      AND: {
        is_active: false,
        created_at: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    },
  });
}

async function changeUserCreationDate(id: string, created_at: Date) {
  return await prisma.user.update({
    where: { id },
    data: { created_at },
  });
}

async function getAllUsers() {
  return await prisma.user.findMany();
}

async function changeUserPassword(id: string, password: string) {
  return await prisma.user.update({
    where: { id },
    data: { password },
  });
}

const user = {
  getUserByEmail,
  getUserById,
  getUserByUsername,
  activateUserById,
  createUser,
  deleteUsersNotActivatedForMoreThanOneDay,
  changeUserPassword,
  test: {
    changeUserCreationDate,
    getAllUsers,
  },
};

export default user;
