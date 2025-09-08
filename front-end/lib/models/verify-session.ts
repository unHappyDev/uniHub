import session from "@/lib/domain/session";
import NotFoundError from "../errors/not-found-error";
import user from "../domain/user";
import ValidationError from "../errors/validation-error";

async function verifySessionByToken(token: string) {
  const dbSessions = await session.getSessionsByToken(token);

  if (dbSessions.length !== 1) {
    throw new NotFoundError({
      message: "Sessão não encontrada",
      action: "Informe um session_id válido",
    });
  }

  const now = new Date(Date.now());
  if (new Date(dbSessions[0].expires_at).getTime() < now.getTime()) {
    throw new ValidationError({
      message: "A sessão expirou",
      action: "Informar uma sessão válida",
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
