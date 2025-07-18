import { cookies } from "next/headers";
import validator from "../validator/validator";

async function getSessionIdFromCookieStore(): Promise<string> {
  const cookieStore = await cookies();
  const sessionIdFromCookies = cookieStore?.get("session_id")?.value;
  const sessionId = validator.validateSessionId(sessionIdFromCookies);
  return sessionId;
}

const sessionId = {
  getSessionIdFromCookieStore,
};

export default sessionId;
