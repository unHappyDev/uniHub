import { z } from "zod";
import UsernameSchema from "./fields/username";
import EmailSchema from "./fields/email";
import PasswordSchema from "./fields/password";

export const RegisterSchema = z
  .object({
    username: UsernameSchema,
    email: EmailSchema,
    password: PasswordSchema,
  })
  .strict();

export default RegisterSchema;
