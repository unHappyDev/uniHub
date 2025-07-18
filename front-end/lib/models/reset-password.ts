import passwordModel from "@/lib/models/password";
import resetPasswordToken from "@/lib/domain/reset-password-token";
import { sendRecoveryEmail } from "@/lib/email";
import user from "@/lib/domain/user";
import NotFoundError from "../errors/not-found-error";

export async function forgotPassword(providedEmail: string) {
  const dbUser = await validUser(providedEmail);
  const dbToken = await resetPasswordToken.createResetPasswordToken(dbUser!.id);

  await sendRecoveryEmail({
    to: dbUser!.email,
    username: dbUser!.username,
    recoveryToken: dbToken.id,
  });

  async function validUser(providedEmail: string) {
    const dbUser = await user.getUserByEmail(providedEmail);

    if (!dbUser) {
      throwUnauthorizedError();
    }

    return dbUser;
  }

  function throwUnauthorizedError() {
    throw new NotFoundError({
      message: "Email not registered",
      action: "Inform correct email",
    });
  }
}

export async function resetPassword(tokenId: string, newPassword: string) {
  const dbToken = await validToken(tokenId);

  const hashedPassword = await passwordModel.hash(newPassword);
  await user.changeUserPassword(dbToken.user_id, hashedPassword);

  await resetPasswordToken.expireResetPasswordTokenById(tokenId);

  async function validToken(tokenId: string) {
    const dbToken =
      await resetPasswordToken.getValidResetPasswordToken(tokenId);

    if (!dbToken) {
      throw new NotFoundError({
        message: "Token not found or expired",
        action: "Create a new token",
      });
    }

    return dbToken;
  }
}
