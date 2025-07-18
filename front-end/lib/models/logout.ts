import session from "@/lib/domain/session";
import NotFoundError from "../errors/not-found-error";

async function logoutSession(sessionId: string) {
  const sessions = await session.expireSessionByToken(sessionId);

  if (sessions.length < 1) {
    throw new NotFoundError({
      message: "Session not found",
      action: "Inform a valid session_id",
    });
  }

  return sessions[0];
}

const logout = {
  logoutSession,
};

export default logout;
