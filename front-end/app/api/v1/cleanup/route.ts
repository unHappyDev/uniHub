import { NextResponse } from "next/server";
import onErrorHandler from "@/lib/errors/handler";
import cleanup from "@/lib/models/cleanup";
import UnauthorizedError from "@/lib/errors/unauthorized-error";

export async function GET(request: Request) {
  try {
    if (
      request.headers.get("Authorization") ===
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      const dataCleaned = await cleanup.cleanupDanglingDataFromDatabase();
      const response = NextResponse.json(
        {
          sessions: dataCleaned.sessions.count,
          users: dataCleaned.users.count,
          activationTokens: dataCleaned.activationTokens.count,
        },
        { status: 200 },
      );
      return response;
    } else {
      throw new UnauthorizedError({
        message: "This endpoint can be executed only by Vercel's cron",
        action: "Stop sending requests",
      });
    }
  } catch (error) {
    return onErrorHandler(error);
  }
}
