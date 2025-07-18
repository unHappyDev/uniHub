import prisma from "@lib/prisma";
import crypto from "node:crypto";

const SESSION_EXPIRATION_IN_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function createSession(userId: string) {
  const sessionToken = crypto.randomBytes(48).toString("hex");
  const sessionExpiry = new Date(Date.now() + SESSION_EXPIRATION_IN_SECONDS);
  const session = await prisma.session.create({
    data: {
      user_id: userId,
      expires_at: sessionExpiry,
      token: sessionToken,
    },
  });
  return session;
}

async function getSessionById(id: string) {
  return prisma.session.findUnique({
    where: { id },
  });
}

async function getSessionsByUserId(userId: string) {
  return prisma.session.findMany({ where: { user_id: userId } });
}

async function expireSessionByToken(token: string) {
  return prisma.session.updateManyAndReturn({
    where: { token },
    data: { expires_at: new Date(Date.now() - SESSION_EXPIRATION_IN_SECONDS) },
  });
}

async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });
}

async function getAllSessions() {
  return prisma.session.findMany();
}

async function createExpiredSession(userId: string) {
  const sessionToken = crypto.randomBytes(48).toString("hex");
  const session = await prisma.session.create({
    data: {
      user_id: userId,
      expires_at: new Date(Date.now() - SESSION_EXPIRATION_IN_SECONDS),
      token: sessionToken,
    },
  });
  return session;
}

async function refreshSessionById(id: string) {
  const sessionExpiry = new Date(Date.now() + SESSION_EXPIRATION_IN_SECONDS);
  return prisma.session.update({
    where: { id },
    data: { expires_at: sessionExpiry },
  });
}

async function getSessionsByToken(token: string) {
  return prisma.session.findMany({
    where: { token },
  });
}

const session = {
  SESSION_EXPIRATION_IN_SECONDS,
  createSession,
  expireSessionByToken,
  deleteExpiredSessions,
  getSessionsByToken,
  refreshSessionById,
  test: {
    getSessionById,
    getSessionsByUserId,
    getAllSessions,
    createExpiredSession,
  },
};

export default session;
