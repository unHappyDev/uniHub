import { z } from "zod";
import EmailSchema from "./fields/email";

const ForgotPasswordSchema = z
  .object({
    email: EmailSchema,
  })
  .strict();

export default ForgotPasswordSchema;
