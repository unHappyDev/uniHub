import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import userDomain from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import resetTokenDomain from "@/lib/domain/reset-password-token";

const BASE_URL = webserver.host;
const LOGIN_PATH = "/api/v1/login";
const FORGOT_PATH = "/api/v1/forgot-password";
const RESET_PATH = "/api/v1/reset-password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("Password Reset Flow", () => {
  let userEmail: string;
  let userPassword: string;
  let userId: string;
  let resetTokenId: string;

  it("registers and activates a new user", async () => {
    userEmail = "tester@example.com";
    userPassword = "StrongPass123!";

    const reg = await request(BASE_URL)
      .post("/api/v1/register")
      .send({ username: "tester", email: userEmail, password: userPassword });
    expect(reg.status).toBe(201);

    const dbUser = await userDomain.getUserByUsername("tester");
    userId = dbUser!.id;
    const actRecord =
      await activationToken.test.getActivationTokenByUserId(userId);
    const actRes = await request(BASE_URL)
      .get("/api/v1/activate")
      .query({ token: actRecord!.id });
    expect(actRes.status).toBe(200);
  });

  describe("POST /forgot-password", () => {
    it("rejects invalid email format", async () => {
      const res = await request(BASE_URL)
        .post(FORGOT_PATH)
        .send({ email: "not-an-email" });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain("email");
    });

    it("rejects unknown email", async () => {
      const res = await request(BASE_URL)
        .post(FORGOT_PATH)
        .send({ email: "nope@nowhere.com" });
      expect(res.status).toBe(404);
      expect(res.body.error.message).toMatch("Email not registered");
    });
  });

  describe("generate reset token", () => {
    it("succeeds for a valid, activated user", async () => {
      const res = await request(BASE_URL)
        .post(FORGOT_PATH)
        .send({ email: userEmail });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ email: userEmail });

      const dbUser = await userDomain.getUserByEmail(userEmail);

      const tok =
        await resetTokenDomain.test.getValidResetPasswordTokenByUserId(
          dbUser!.id,
        );
      resetTokenId = tok!.id;
      expect(uuidVersion(resetTokenId)).toBe(4);
    });
  });

  describe("POST /reset-password", () => {
    it("rejects invalid token format", async () => {
      const res = await request(BASE_URL).post(RESET_PATH).send({
        token: "not-a-uuid",
        password: "AnotherPass123!",
      });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain("uuid");
    });

    it("rejects expired or non‑existent token", async () => {
      await request(BASE_URL).post(RESET_PATH).send({
        token: resetTokenId,
        password: "AnotherPass123!",
      });
      const res = await request(BASE_URL).post(RESET_PATH).send({
        token: resetTokenId,
        password: "AnotherPass123!",
      });
      expect(res.status).toBe(404);
      expect(res.body.error.message).toContain("expired");
    });

    it("rejects invalid password (too weak)", async () => {
      const fresh = await resetTokenDomain.createResetPasswordToken(userId);
      const res = await request(BASE_URL).post(RESET_PATH).send({
        token: fresh.id,
        password: "short",
      });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/password/i);
    });

    it("resets password successfully with valid token + strong password", async () => {
      const fresh = await resetTokenDomain.createResetPasswordToken(userId);
      const newPass = "NewStrongPass456!";

      const res = await request(BASE_URL).post(RESET_PATH).send({
        token: fresh.id,
        password: newPass,
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ token: fresh.id });

      userPassword = newPass;
    });
  });

  describe("login with old vs new password", () => {
    it("fails with old password", async () => {
      const res = await request(BASE_URL).post(LOGIN_PATH).send({
        email: userEmail,
        password: "StrongPass123!",
      });
      expect(res.status).toBe(401);
    });

    it("succeeds with new password", async () => {
      const res = await request(BASE_URL).post(LOGIN_PATH).send({
        email: userEmail,
        password: userPassword,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("expires_at");
    });
  });
});
