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
});

describe("GET /api/v1/verify-session", () => {
  it("should return session and user info for valid session", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "verifysession",
        email: "verifysession@example.com",
        password: "ValidPass123!",
      });
    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("verifysession");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "verifysession@example.com",
      password: "ValidPass123!",
    });
    expect(loginResponse.status).toBe(201);

    const session_id = sessionCookie.extractSessionCookie(loginResponse);
    const verifySessionResponse = await request(BASE_URL)
      .get("/api/v1/verify-session")
      .set("Cookie", session_id);

    expect(verifySessionResponse.status).toBe(200);
    expect(verifySessionResponse.body).toEqual({
      user: {
        username: "verifysession",
        email: "verifysession@example.com",
        role: "USER",
      },
      session: {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        expires_at: expect.any(String),
      },
    });

    expect(uuidVersion(verifySessionResponse.body.session.id)).toBe(4);

    expect(
      Date.parse(verifySessionResponse.body.session.created_at),
    ).not.toBeNaN();
    expect(
      Date.parse(verifySessionResponse.body.session.updated_at),
    ).not.toBeNaN();
    expect(
      Date.parse(verifySessionResponse.body.session.expires_at),
    ).not.toBeNaN();

    const dbSession = await session.test.getSessionById(
      verifySessionResponse.body.session.id,
    );
    expect(dbSession).not.toBeNull();

    expect(loginResponse.get("Set-Cookie")![0]).toEqual(
      `session_id=${dbSession!.token}; Max-Age=2592000; Path=/; HttpOnly`,
    );
    expect(loginResponse.get("Cache-Control")).toContain("no-cache");
    expect(loginResponse.get("Cache-Control")).toContain("no-store");
    expect(loginResponse.get("Cache-Control")).toContain("must-revalidate");
  });

  it("should return 400 for expired session", async () => {
    const dbUser = await user.getUserByUsername("verifysession");

    const expiredSession = await session.test.createExpiredSession(dbUser!.id);

    const verifySessionResponse = await request(BASE_URL)
      .get("/api/v1/verify-session")
      .set("Cookie", `session_id=${expiredSession.token}`);

    expect(verifySessionResponse.status).toBe(400);
    expect(verifySessionResponse.body.error).toEqual({
      name: "ValidationError",
      message: "Session was expired",
      action: "Inform a valid session",
      status_code: 400,
    });
  });

  it("should return 400 for invalid session token", async () => {
    const invalidCookie = "session_id=invalid_token; Path=/; HttpOnly";

    const response = await request(BASE_URL)
      .get("/api/v1/verify-session")
      .set("Cookie", invalidCookie);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain(
      "must be exactly 96 characters",
    );
  });

  it("should return 404 when no session found", async () => {
    const dbUser = await user.getUserByUsername("verifysession");
    const expiredSession = await session.test.createExpiredSession(dbUser!.id);
    await session.deleteExpiredSessions();
    const response = await request(BASE_URL)
      .get("/api/v1/verify-session")
      .set("Cookie", `session_id=${expiredSession.token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual({
      name: "NotFoundError",
      message: "Session not found",
      action: "Inform a valid session_id",
      status_code: 404,
    });
  });

  it("should return 400 when no session cookie exists", async () => {
    const response = await request(BASE_URL).get("/api/v1/verify-session");

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Required");
  });
});
