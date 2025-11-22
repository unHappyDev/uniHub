import onErrorHandler from "@/lib/errors/handler";
import cacheControl from "@/lib/models/cache-control";
import sessionId from "@/lib/models/context/session-id";
import cookieControl from "@/lib/models/cookie-control";
import logout from "@/lib/models/logout";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const providedSessionId = await sessionId.getSessionIdFromCookieStore();
    const expiredSession = await logout.logoutSession(providedSessionId);

    const response = NextResponse.json(
      {
        id: expiredSession.id,
        created_at: expiredSession.created_at,
        updated_at: expiredSession.updated_at,
        expires_at: expiredSession.expires_at,
      },
      { status: 200 },
    );

    cacheControl.setNoCache(response);
    cookieControl.clearSessionIdCookie(response);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}
