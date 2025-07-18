import activationToken from "@/lib/domain/activation-token";
import user from "@/lib/domain/user";
import NotFoundError from "@/lib/errors/not-found-error";
import ValidationError from "@/lib/errors/validation-error";

async function activateUserByToken(token: string) {
  const dbToken = await validateToken(token);
  const dbUser = await validateUser(dbToken.user_id);
  await user.activateUserById(dbUser.id);
  await activationToken.expireTokenById(dbToken.id);
  return dbToken;
}

async function validateToken(token: string) {
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

async function validateUser(userId: string) {
  const dbUser = await user.getUserById(userId);
  if (!dbUser) {
    throw new NotFoundError({
      message: "User not found",
      action: "Inform a valid user",
    });
  }

  return dbUser;
}

const activate = {
  activateUserByToken,
};

export default activate;
