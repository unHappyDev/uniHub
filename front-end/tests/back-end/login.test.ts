import { describe, it, expect } from "vitest";
import request from "supertest";

const BASE_URL = "http://18.188.33.134:8080";

describe("POST /user", () => {
  it("should create user successfully", async () => {
    const registerResponse = await request(BASE_URL).post("/user").send({
      name: "Henrique",
      email: "henri@gmail.com",
      password: "@123",
      role: "professor",
    });

    expect(registerResponse.status).toBe(201);
  });
});
