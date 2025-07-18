import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters");

export default PasswordSchema;
