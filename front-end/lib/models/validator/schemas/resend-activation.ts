import { z } from "zod";
import EmailSchema from "./fields/email";
import TokenSchema from "./fields/token";

const ResendActivationSchema = z
  .object({
    email: EmailSchema.optional(),
    token: TokenSchema.optional(),
  })
  .refine((data) => (data.email ? !data.token : data.token), {
    message: "Provide either email or token, not both",
    path: ["email"],
  });

export default ResendActivationSchema;
