import { sendActivationEmail } from "@/lib/email";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import password from "@/lib/models/password";
import UnauthorizedError from "../errors/unauthorized-error";
import ForbiddenError from "../errors/forbidden-error";
import session from "../domain/session";

async function loginUser(emailProvided: string, passwordProvided: string) {
  const dbUser = await user.getUserByEmail(emailProvided);

  if (!dbUser) {
    throwUnauthorizedError();
  }

  if (!dbUser!.is_active) {
    const token = await activationToken.createActivationToken(dbUser!.id);

    await sendActivationEmail({
      to: dbUser!.email,
      username: dbUser!.username,
      activationToken: token.id,
    });

    throwForbiddenError();
  }

  const passwordMatches = await password.compare(
    passwordProvided,
    dbUser!.password,
  );

  if (!passwordMatches) {
    throwUnauthorizedError();
  }

  return session.createSession(dbUser!.id);

  function throwUnauthorizedError() {
    throw new UnauthorizedError({
      message: "E-mail ou senha inválidos",
      action: "Informe e-mail e senha corretos",
    });
  }

  function throwForbiddenError() {
    throw new ForbiddenError({
      message: "O usuário precisa de ativação para efetuar login",
      action: "Por favor, verifique seu e-mail e ative o usor",
    });
  }
}

const login = {
  loginUser,
};

export default login;
