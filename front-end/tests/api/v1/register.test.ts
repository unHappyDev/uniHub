import { version as uuidVersion } from "uuid";
import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import user from "@/lib/domain/user";
import password from "@/lib/models/password";
import activationToken from "@/lib/domain/activation-token";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.deactivateFirewall();
});

describe("POST /api/v1/register", () => {
  it("should register a new user successfully", async () => {
    const response = await request(BASE_URL).post("/api/v1/register").send({
      username: "succ ésS",
      email: "successCAPS@sample.com",
      password: "success_1234",
    });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: response.body.id,
      username: "succ ésS",
      created_at: response.body.created_at,
      updated_at: response.body.updated_at,
      is_active: false,
    });

    expect(uuidVersion(response.body.id)).toBe(4);
    expect(Date.parse(response.body.created_at)).not.toBeNaN();
    expect(Date.parse(response.body.updated_at)).not.toBeNaN();

    const userInDatabase = await user.getUserByUsername("suCC éSS");
    const passwordsMatch = await password.compare(
      "success_1234",
      userInDatabase!.password,
    );
    const wrongPasswordMatch = await password.compare(
      "wrongpassword",
      userInDatabase!.password,
    );

    expect(passwordsMatch).toBe(true);
    expect(wrongPasswordMatch).toBe(false);
    expect(userInDatabase!.email).toBe("successcaps@sample.com");
  });

  it("should reject invalid username", async () => {
    const tests = [
      { username: "ab", error: "at least 3 characters" },
      { username: "a".repeat(31), error: "exceed 30 characters" },
      { username: "invalid user!", error: "only letters" },
      { username: "admin", error: "reserved" },
    ];

    let count = 0;
    for (const test of tests) {
      count += 1;

      const response = await request(BASE_URL)
        .post("/api/v1/register")
        .send({
          username: test.username,
          email: `test${count}@example.com`,
          password: "ValidPass123!",
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(test.error);
    }
  });

  it("should reject invalid email address", async () => {
    const response = await request(BASE_URL).post("/api/v1/register").send({
      username: "validuser",
      email: "invalid-email",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Invalid email address");
  });

  it("should reject invalid password", async () => {
    const tests = [
      { password: "short", error: "at least 8 characters" },
      { password: "a".repeat(73), error: "exceed 72 characters" },
    ];

    let count = 0;
    for (const test of tests) {
      count += 1;

      const response = await request(BASE_URL)
        .post("/api/v1/register")
        .send({
          username: `validuser${count}`,
          email: `test@example${count}.com`,
          password: test.password,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(test.error);
    }
  });

  it("should reject duplicate username (case-insensitive)", async () => {
    await request(BASE_URL).post("/api/v1/register").send({
      username: "ExistingUser",
      email: "first@example.com",
      password: "FirstPass123!",
    });

    const response = await request(BASE_URL).post("/api/v1/register").send({
      username: "existinguser",
      email: "second@example.com",
      password: "SecondPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Username already exists");
  });

  it("should reject duplicate email (case-insensitive)", async () => {
    await request(BASE_URL).post("/api/v1/register").send({
      username: "FirstUser",
      email: "FIRST@example.com",
      password: "FirstPass123!",
    });

    const response = await request(BASE_URL).post("/api/v1/register").send({
      username: "SecondUser",
      email: "first@example.com",
      password: "SecondPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Email already registered");
  });

  it("should register a new user and create activation token", async () => {
    const response = await request(BASE_URL).post("/api/v1/register").send({
      username: "testuser1234",
      email: "test1234@example.com",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(201);
    const dbUser = await user.getUserByUsername("testuser1234");

    expect(dbUser).not.toBeNull();

    const token = await activationToken.test.getActivationTokenByUserId(
      dbUser!.id,
    );

    expect(token).not.toBeNull();
  });
});
