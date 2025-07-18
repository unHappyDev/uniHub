import { Response } from "supertest";

function extractSessionCookie(response: Response): string {
  const setCookieHeader = response.get("Set-Cookie");

  if (!setCookieHeader || setCookieHeader.length === 0) {
    throw new Error("No Set-Cookie header found");
  }

  const sessionCookie = setCookieHeader.find((c) =>
    c.startsWith("session_id="),
  );

  if (!sessionCookie) {
    throw new Error("Session cookie not found in Set-Cookie header");
  }

  return sessionCookie.split(";")[0];
}

const sessionCookie = {
  extractSessionCookie,
};

export default sessionCookie;
