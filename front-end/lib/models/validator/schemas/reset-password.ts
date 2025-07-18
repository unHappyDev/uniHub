import z from "zod";
import PasswordSchema from "./fields/password";
import TokenSchema from "./fields/token";

const ResetPasswordSchema = z
  .object({
    token: TokenSchema,
    password: PasswordSchema,
  })
  .strict();

export default ResetPasswordSchema;
