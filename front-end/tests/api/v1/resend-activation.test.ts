import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("POST /api/v1/resend-activation", () => {
  it("should resend activation email using email", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "resendemail",
        email: "resend@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(BASE_URL)
      .post("/api/v1/resend-activation")
      .send({ email: "resend@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      email: "resend@example.com",
    });

    expect(response.get("Cache-Control")).toContain("no-cache");
    expect(response.get("Cache-Control")).toContain("no-store");
    expect(response.get("Cache-Control")).toContain("must-revalidate");
  });

  it("should resend activation using token", async () => {
    const registerResponse = await request(BASE_URL)
      .post("/api/v1/register")
      .send({
        username: "resendtoken",
        email: "resendtoken@example.com",
        password: "ValidPass123!",
      });

    expect(registerResponse.status).toBe(201);

    const dbUser = await user.getUserByUsername("resendtoken");
    const tokenRecord = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    const response = await request(BASE_URL)
      .post("/api/v1/resend-activation")
      .send({ token: tokenRecord!.id });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      token: tokenRecord!.id,
    });

    expect(response.get("Cache-Control")).toContain("no-cache");
  });

  it("should return 400 if neither email nor token is provided", async () => {
    const response = await request(BASE_URL)
      .post("/api/v1/resend-activation")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("email");
    expect(response.body.error.message).toContain("token");
  });

  it("should return 400 for invalid email format", async () => {
    const response = await request(BASE_URL)
      .post("/api/v1/resend-activation")
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("email");
  });

  it("should return 400 for invalid token format", async () => {
    const response = await request(BASE_URL)
      .post("/api/v1/resend-activation")
      .send({ token: "not-a-uuid" });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Invalid uuid");
  });
});
