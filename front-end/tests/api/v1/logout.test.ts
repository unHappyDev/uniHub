import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import session from "@/lib/domain/session";
import sessionCookie from "@/tests/utils/session-cookie";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.deactivateFirewall();
});

describe("DELETE /api/v1/logout", () => {
  it("should log out user successfully with valid session", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "logoutuser",
        email: "logout@example.com",
        password: "ValidPass123!",
      });
    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("logoutuser");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "logout@example.com",
      password: "ValidPass123!",
    });
    expect(loginResponse.status).toBe(201);

    const session_id = sessionCookie.extractSessionCookie(loginResponse);

    const logoutResponse = await request(BASE_URL)
      .delete("/api/v1/logout")
      .set("Cookie", session_id);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      expires_at: expect.any(String),
    });

    expect(uuidVersion(logoutResponse.body.id)).toBe(4);

    expect(Date.parse(logoutResponse.body.created_at)).not.toBeNaN();
    expect(Date.parse(logoutResponse.body.updated_at)).not.toBeNaN();
    expect(Date.parse(logoutResponse.body.expires_at)).not.toBeNaN();

    const dbSession = await session.test.getSessionById(logoutResponse.body.id);
    expect(dbSession).not.toBeNull();
    expect(new Date(dbSession!.expires_at) < new Date()).toBe(true);

    const logoutCookie = sessionCookie.extractSessionCookie(logoutResponse);

    expect(logoutCookie).toContain("session_id=invalid");
  });

  it("should return 400 when no session cookie is provided", async () => {
    const response = await request(BASE_URL).delete("/api/v1/logout");

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      name: "ValidationError",
      message: "Required",
      action: "Adjust the data sent and try again.",
      status_code: 400,
    });
  });

  it("should return 400 for invalid session cookie", async () => {
    const invalidCookie = "session_id=invalid_session_123";

    const response = await request(BASE_URL)
      .delete("/api/v1/logout")
      .set("Cookie", invalidCookie);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      name: "ValidationError",
      message:
        "Session ID must be exactly 96 characters. Session ID must be alphanumeric",
      action: "Adjust the data sent and try again.",
      status_code: 400,
    });
  });

  it("should return 200 for already expired session", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "expiredsession",
        email: "expired@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("expiredsession");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "expired@example.com",
      password: "ValidPass123!",
    });

    expect(loginResponse.status).toBe(201);

    const sessionId = loginResponse.body.id;
    await session.expireSessionByToken(sessionId);

    const session_id = sessionCookie.extractSessionCookie(loginResponse);

    const logoutResponse = await request(BASE_URL)
      .delete("/api/v1/logout")
      .set("Cookie", session_id);

    expect(logoutResponse.status).toBe(200);
  });

  it("should set no-cache headers", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "cachetest",
        email: "cache@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("cachetest");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "cache@example.com",
      password: "ValidPass123!",
    });

    expect(loginResponse.status).toBe(201);

    const session_id = sessionCookie.extractSessionCookie(loginResponse);

    const logoutResponse = await request(BASE_URL)
      .delete("/api/v1/logout")
      .set("Cookie", session_id);

    expect(logoutResponse.headers["cache-control"]).toContain("no-cache");
    expect(logoutResponse.headers["cache-control"]).toContain("no-store");
    expect(logoutResponse.headers["cache-control"]).toContain(
      "must-revalidate",
    );
  });
});
