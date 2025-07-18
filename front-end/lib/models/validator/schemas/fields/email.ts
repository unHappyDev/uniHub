import { z } from "zod";

const EmailSchema = z
  .string()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase().trim());

export default EmailSchema;
