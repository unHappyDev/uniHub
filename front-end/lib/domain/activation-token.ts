import prisma from "@lib/prisma";

const EXPIRATION_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

async function createActivationToken(userId: string) {
  const tokenExpiry = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const token = await prisma.activationToken.create({
    data: {
      user_id: userId,
      expires_at: tokenExpiry,
    },
  });
  return token;
}

async function getActivationTokenByUserId(userId: string) {
  const token = await prisma.activationToken.findFirst({
    where: { user_id: userId },
  });
  return token;
}

async function getActivationTokenById(id: string) {
  const token = await prisma.activationToken.findUnique({
    where: { id },
  });
  return token;
}

async function expireTokenById(id: string) {
  const token = await prisma.activationToken.update({
    where: { id },
    data: { expires_at: new Date(Date.now() - EXPIRATION_IN_MILLISECONDS) },
  });
  return token;
}

async function getActivationTokensByUserId(userId: string) {
  return await prisma.activationToken.findMany({ where: { user_id: userId } });
}

async function deleteExpiredActivationTokens() {
  return await prisma.activationToken.deleteMany({
    where: { expires_at: { lt: new Date() } },
  });
}

async function getAllActivationTokens() {
  return await prisma.activationToken.findMany();
}

async function createExpiredActivationToken(userId: string) {
  const tokenExpiry = new Date(Date.now() - EXPIRATION_IN_MILLISECONDS);
  const token = await prisma.activationToken.create({
    data: {
      user_id: userId,
      expires_at: tokenExpiry,
    },
  });
  return token;
}

const activationToken = {
  createActivationToken,
  getActivationTokenById,
  expireTokenById,
  test: {
    getActivationTokenByUserId,
    getActivationTokensByUserId,
    getAllActivationTokens,
    createExpiredActivationToken,
  },
  deleteExpiredActivationTokens,
};

export default activationToken;
