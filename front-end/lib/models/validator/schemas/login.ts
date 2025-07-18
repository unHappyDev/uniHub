import { z } from "zod";
import EmailSchema from "./fields/email";
import PasswordSchema from "./fields/password";

const LoginSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
  })
  .strict();

export default LoginSchema;
