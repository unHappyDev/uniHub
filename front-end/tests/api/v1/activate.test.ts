import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.deactivateFirewall();
});

describe("GET /api/v1/activate", () => {
  it("should activate user successfully with valid token", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "activateme",
        email: "activate@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("activateme");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );
    const validToken = tokenRecord!.id;

    const response = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: validToken });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      expires_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });

    expect(uuidVersion(response.body.id)).toBe(4);

    expect(Date.parse(response.body.expires_at)).not.toBeNaN();
    expect(Date.parse(response.body.created_at)).not.toBeNaN();
    expect(Date.parse(response.body.updated_at)).not.toBeNaN();

    const activatedUser = await user.getUserById(dbUser!.id);
    expect(activatedUser!.is_active).toBe(true);

    const expiredToken = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    expect(new Date(expiredToken!.expires_at) < new Date(Date.now())).toBe(
      true,
    );
  });

  it("should return 500 for invalid token", async () => {
    const invalidToken = "invalid-token-123";

    const response = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: invalidToken });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toEqual("Invalid uuid");
  });

  it("should return 500 for expired token", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "expiredtoken",
        email: "expired@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("expiredtoken");
    await activationToken.test.getAllActivationTokens();
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await activationToken.expireTokenById(tokenRecord!.id);

    const response = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toEqual("Token was expired");
  });

  it("should return 400 for already used token", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "alreadyused",
        email: "already@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("alreadyused");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    const response = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toEqual("Token was expired");
  });

  it("should return 400 when token is missing", async () => {
    const response = await request(BASE_URL).get("/api/v1/activate");

    expect(response.status).toBe(400);
    expect(response.body.error.message).toEqual(
      "Expected string, received null",
    );
  });

  it("should set no-cache headers", async () => {
    await request(BASE_URL).post("/api/v1/register").send({
      username: "cachetest",
      email: "cache@example.com",
      password: "ValidPass123!",
    });

    const dbUser = await user.getUserByUsername("cachetest");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    const response = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: tokenRecord!.id });

    expect(response.get("Cache-Control")).toContain("no-cache");
    expect(response.get("Cache-Control")).toContain("no-store");
    expect(response.get("Cache-Control")).toContain("must-revalidate");
  });
});
