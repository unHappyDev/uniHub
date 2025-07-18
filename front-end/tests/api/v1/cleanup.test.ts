import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import session from "@/lib/domain/session";
import { subDays } from "date-fns";

const BASE_URL = webserver.host;
const CLEANUP_URL = "/api/v1/cleanup";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("GET /api/v1/cleanup", () => {
  it("should delete expired sessions, tokens, and old unactivated users", async () => {
    const dbUser = await user.createUser(
      "expireduser1",
      "expired1@example.com",
      "ValidPass123!",
    );

    const dbSession = await session.createSession(dbUser.id);
    await session.expireSessionByToken(dbSession.token);

    const token = await activationToken.createActivationToken(dbUser.id);
    await activationToken.expireTokenById(token.id);

    const oldUser = await user.createUser(
      "olduser1",
      "old1@example.com",
      "ValidPass123!",
    );

    await user.test.changeUserCreationDate(oldUser.id, subDays(new Date(), 2));

    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      sessions: 1,
      activationTokens: 1,
      users: 1,
    });

    const sessionsAfter = await session.test.getAllSessions();
    expect(sessionsAfter.length).toBe(0);

    const tokensAfter = await activationToken.test.getAllActivationTokens();
    expect(tokensAfter.length).toBe(0);

    const usersAfter = await user.test.getAllUsers();
    expect(usersAfter.length).toBe(1);
    expect(usersAfter[0].username).toBe("expireduser1");
  });

  it("should preserve valid sessions and tokens", async () => {
    const testUser = await user.createUser(
      "validuser5",
      "valid5@example.com",
      "ValidPass123!",
    );

    await session.createSession(testUser.id);

    await activationToken.createActivationToken(testUser.id);

    await user.createUser(
      "recentuser5",
      "recent5@example.com",
      "ValidPass123!",
    );

    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      sessions: 0,
      activationTokens: 0,
      users: 0,
    });

    const sessionsAfter = await session.test.getAllSessions();
    expect(sessionsAfter.length).toBe(1);

    const tokensAfter = await activationToken.test.getAllActivationTokens();
    expect(tokensAfter.length).toBe(1);

    const usersAfter = await user.test.getAllUsers();
    expect(usersAfter.length).toBe(3);
  });

  it("should return 401 without authorization header", async () => {
    const response = await request(BASE_URL).get(CLEANUP_URL);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: expect.objectContaining({
        message: "This endpoint can be executed only by Vercel's cron",
        action: "Stop sending requests",
      }),
    });
  });

  it("should handle empty database", async () => {
    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      sessions: 0,
      activationTokens: 0,
      users: 0,
    });
  });

  it("should delete multiple expired records", async () => {
    const testUser = await user.createUser(
      "multiuser",
      "multi@example.com",
      "ValidPass123!",
    );

    await Promise.all([
      session.test.createExpiredSession(testUser.id),
      session.test.createExpiredSession(testUser.id),
      session.test.createExpiredSession(testUser.id),
    ]);

    await Promise.all([
      activationToken.test.createExpiredActivationToken(testUser.id),
      activationToken.test.createExpiredActivationToken(testUser.id),
    ]);

    const oldUser = await user.createUser(
      "oldunactivated2",
      "old2@example.com",
      "ValidPass123!",
    );

    user.test.changeUserCreationDate(oldUser.id, subDays(new Date(), 2));

    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      sessions: 3,
      activationTokens: 2,
      users: 1,
    });
  });

  it("should not delete recently created unactivated users", async () => {
    const recentUser = await user.createUser(
      "recentunactivated3",
      "recent3@example.com",
      "ValidPass123!",
    );

    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.body.users).toBe(0);

    const userAfter = user.getUserById(recentUser.id);
    expect(userAfter).not.toBeNull();
  });

  it("should delete only unactivated users older than 1 day", async () => {
    const oldUser = await user.createUser(
      "oldunactivated4",
      "old4@example.com",
      "ValidPass123!",
    );

    await user.test.changeUserCreationDate(oldUser.id, subDays(new Date(), 2));

    const recentUser = await user.createUser(
      "recentunactivated4",
      "recent4@example.com",
      "ValidPass123!",
    );

    const response = await request(BASE_URL)
      .get(CLEANUP_URL)
      .set("Authorization", `Bearer ${process.env.CRON_SECRET}`);

    expect(response.body.users).toBe(1);

    const oldUserAfter = await user.getUserById(oldUser.id);
    expect(oldUserAfter).toBeNull();

    const recentUserAfter = await user.getUserById(recentUser.id);

    expect(recentUserAfter).not.toBeNull();
  });
});
