import user from "@/lib/domain/user";
import passwordModel from "@/lib/models/password";
import ValidationError from "@/lib/errors/validation-error";
import activation from "@/lib/models/activation";
import event from "@lib/domain/event";

async function registerUser(
  username: string,
  email: string,
  password: string,
  clientIp: string,
) {
  await validUsername(username);
  await validEmail(email);

  const hashedPassword = await passwordModel.hash(password);

  const newUser = await user.createUser(username, email, hashedPassword);

  await event.createEvent("create:user", newUser.id, clientIp, {
    id: newUser.id,
  });

  await activation.sendActivationEmailTo(email);

  return newUser;

  async function validUsername(username: string) {
    const userFound = await user.getUserByUsername(username);
    if (userFound) {
      throw new ValidationError({
        message: "Username already exists",
        action: "Use another username for this operation",
      });
    }
  }

  async function validEmail(email: string) {
    const userFound = await user.getUserByEmail(email);
    if (userFound) {
      throw new ValidationError({
        message: "Email already registered",
        action: "Use another email for this operation",
      });
    }
  }
}

const register = {
  registerUser,
};

export default register;
