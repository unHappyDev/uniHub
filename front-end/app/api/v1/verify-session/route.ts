import onErrorHandler from "@/lib/errors/handler";
import cacheControl from "@/lib/models/cache-control";
import sessionId from "@/lib/models/context/session-id";
import verifySession from "@/lib/models/verify-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const providedSessionId = await sessionId.getSessionIdFromCookieStore();
    const sessionInfo =
      await verifySession.verifySessionByToken(providedSessionId);

    const response = NextResponse.json(
      {
        user: {
          username: sessionInfo.user?.username,
          email: sessionInfo.user?.email,
          role: sessionInfo.user?.role,
        },
        session: {
          id: sessionInfo.session?.id,
          created_at: sessionInfo.session?.created_at,
          updated_at: sessionInfo.session?.updated_at,
          expires_at: sessionInfo.session?.expires_at,
        },
      },
      { status: 200 },
    );

    cacheControl.setNoCache(response);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}
