import session from "@/lib/domain/session";
import NotFoundError from "../errors/not-found-error";
import user from "../domain/user";
import ValidationError from "../errors/validation-error";

async function verifySessionByToken(token: string) {
  const dbSessions = await session.getSessionsByToken(token);

  if (dbSessions.length !== 1) {
    throw new NotFoundError({
      message: "Session not found",
      action: "Inform a valid session_id",
    });
  }

  const now = new Date(Date.now());
  if (new Date(dbSessions[0].expires_at).getTime() < now.getTime()) {
    throw new ValidationError({
      message: "Session was expired",
      action: "Inform a valid session",
    });
  }

  const dbSession = await session.refreshSessionById(dbSessions[0].id);
  const dbUser = await user.getUserById(dbSession.user_id);

  return { session: dbSession, user: dbUser };
}

const verifySession = {
  verifySessionByToken,
};

export default verifySession;
