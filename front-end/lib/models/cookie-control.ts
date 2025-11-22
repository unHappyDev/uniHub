import * as cookie from "cookie";
import { NextResponse } from "next/server";
import session from "../domain/session";

function setSessionIdCookie(response: NextResponse, sessionToken: string) {
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("session_id", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: session.SESSION_EXPIRATION_IN_SECONDS,
    }),
  );
}

function clearSessionIdCookie(response: NextResponse) {
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("session_id", "invalid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: -1,
    }),
  );
}

const cookieControl = {
  setSessionIdCookie,
  clearSessionIdCookie,
};

export default cookieControl;
