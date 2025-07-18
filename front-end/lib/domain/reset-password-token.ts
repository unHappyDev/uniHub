import prisma from "@lib/prisma";

const EXPIRATION_MS = 15 * 60 * 1000; // 15m

async function createResetPasswordToken(userId: string) {
  await prisma.resetPasswordToken.updateMany({
    where: { user_id: userId },
    data: { expires_at: new Date(Date.now() - EXPIRATION_MS) },
  });

  const expiresAt = new Date(Date.now() + EXPIRATION_MS);
  return prisma.resetPasswordToken.create({
    data: { user_id: userId, expires_at: expiresAt },
  });
}

async function getValidResetPasswordToken(tokenId: string) {
  return prisma.resetPasswordToken.findFirst({
    where: {
      id: tokenId,
      expires_at: { gt: new Date() },
    },
  });
}

async function expireResetPasswordTokenById(tokenId: string) {
  return prisma.resetPasswordToken.update({
    where: { id: tokenId },
    data: { expires_at: new Date(Date.now() - EXPIRATION_MS) },
  });
}

async function getValidResetPasswordTokenByUserId(user_id: string) {
  return prisma.resetPasswordToken.findFirst({
    where: {
      user_id,
      expires_at: { gt: new Date() },
    },
  });
}

const resetPasswordToken = {
  createResetPasswordToken,
  getValidResetPasswordToken,
  expireResetPasswordTokenById,
  test: {
    getValidResetPasswordTokenByUserId,
  },
};

export default resetPasswordToken;
