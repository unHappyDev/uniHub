import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import session from "@/lib/domain/session";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.deactivateFirewall();
});

describe("POST /api/v1/login", () => {
  it("should log in an active user successfully", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "activeuser",
        email: "active@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("activeuser");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "active@example.com",
      password: "ValidPass123!",
    });

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      expires_at: expect.any(String),
    });

    expect(uuidVersion(loginResponse.body.id)).toBe(4);

    expect(Date.parse(loginResponse.body.created_at)).not.toBeNaN();
    expect(Date.parse(loginResponse.body.updated_at)).not.toBeNaN();
    expect(Date.parse(loginResponse.body.expires_at)).not.toBeNaN();

    const dbSession = await session.test.getSessionById(loginResponse.body.id);
    expect(dbSession).not.toBeNull();

    expect(loginResponse.get("Set-Cookie")![0]).toEqual(
      `session_id=${dbSession!.token}; Max-Age=2592000; Path=/; HttpOnly`,
    );
    expect(loginResponse.get("Cache-Control")).toContain("no-cache");
    expect(loginResponse.get("Cache-Control")).toContain("no-store");
    expect(loginResponse.get("Cache-Control")).toContain("must-revalidate");
  });

  it("should return 401 for incorrect password", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "user401",
        email: "user401@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("user401");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "user401@example.com",
      password: "wrong_password",
    });

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.error).toEqual({
      name: "UnauthorizedError",
      message: "Invalid email or password",
      action: "Inform correct email and password",
      status_code: 401,
    });

    const sessions = await session.test.getSessionsByUserId(dbUser!.id);
    expect(sessions.length).toBe(0);
  });

  it("should return 401 for non-existing email", async () => {
    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "nonexistent@example.com",
      password: "anypassword",
    });

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.error).toEqual({
      name: "UnauthorizedError",
      message: "Invalid email or password",
      action: "Inform correct email and password",
      status_code: 401,
    });
  });

  it("should return 403 for inactive user and send activation email", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "inactiveuser",
        email: "inactive@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "inactive@example.com",
      password: "ValidPass123!",
    });

    expect(loginResponse.status).toBe(403);
    expect(loginResponse.body.error).toEqual({
      name: "ForbiddenError",
      message: "User need activation to log in",
      action: "Please check your email and activate user",
      status_code: 403,
    });

    const dbUser = await user.getUserByUsername("inactiveuser");
    const tokens = await activationToken.test.getActivationTokensByUserId(
      dbUser!.id,
    );

    expect(tokens.length).toBe(2);
  });

  it("should return 400 for invalid email address", async () => {
    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "invalid-email",
      password: "anypassword",
    });

    expect(loginResponse.status).toBe(400);
    expect(loginResponse.body.error.message).toContain("Invalid email address");
  });

  it("should return 400 for missing password", async () => {
    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      email: "test@example.com",
    });

    expect(loginResponse.status).toBe(400);
    expect(loginResponse.body.error.message).toContain("Password");
  });

  it("should return 400 for missing email", async () => {
    const loginResponse = await request(BASE_URL).post("/api/v1/login").send({
      password: "ValidPass123!",
    });

    expect(loginResponse.status).toBe(400);
    expect(loginResponse.body.error.message).toContain("Email");
  });

  it("should set no-cache headers", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "cachetest",
        email: "cachetest@example.com",
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
      email: "cachetest@example.com",
      password: "ValidPass123!",
    });

    expect(loginResponse.get("Cache-Control")).toContain("no-cache");
    expect(loginResponse.get("Cache-Control")).toContain("no-store");
    expect(loginResponse.get("Cache-Control")).toContain("must-revalidate");
  });
});
