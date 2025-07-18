import { sendActivationEmail } from "@/lib/email";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import ValidationError from "@/lib/errors/validation-error";
import NotFoundError from "../errors/not-found-error";

async function sendActivationEmailTo(email: string) {
  const dbUser = await validEmail(email);
  const token = await activationToken.createActivationToken(dbUser.id);

  await sendActivationEmail({
    to: email,
    username: dbUser.username,
    activationToken: token.id,
  });

  return dbUser;

  async function validEmail(email: string) {
    const userFound = await user.getUserByEmail(email);
    if (!userFound) {
      throw new ValidationError({
        message: "Email not registered",
        action: "Use another email for this operation",
      });
    }
    return userFound;
  }
}

async function resendActivationToken(token: string) {
  const dbToken = await validToken(token);
  const dbUser = await validUser(dbToken.user_id);

  await sendActivationEmail({
    to: dbUser.email,
    username: dbUser.username,
    activationToken: dbToken.id,
  });

  async function validToken(token: string) {
    const dbToken = await activationToken.getActivationTokenById(token);
    if (!dbToken) {
      throw new NotFoundError({
        message: "Token not found",
        action: "Inform a valid token",
      });
    }

    const now = new Date(Date.now());
    if (new Date(dbToken.expires_at).getTime() < now.getTime()) {
      throw new ValidationError({
        message: "Token was expired",
        action: "Inform a valid token",
      });
    }

    return dbToken;
  }

  async function validUser(userId: string) {
    const dbUser = await user.getUserById(userId);
    if (!dbUser) {
      throw new NotFoundError({
        message: "User not found",
        action: "Inform a valid user",
      });
    }
    return dbUser;
  }
}

const register = {
  sendActivationEmailTo,
  resendActivationToken,
};

export default register;
