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
        message: "O nome de usuário já existe",
        action: "Use outro nome de usuário para esta operação",
      });
    }
  }

  async function validEmail(email: string) {
    const userFound = await user.getUserByEmail(email);
    if (userFound) {
      throw new ValidationError({
        message: "E-mail já cadastrado",
        action: "Use outro e-mail para esta operação",
      });
    }
  }
}

const register = {
  registerUser,
};

export default register;
