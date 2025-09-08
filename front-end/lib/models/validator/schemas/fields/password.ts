import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .max(72, "A senha não pode exceder 72 caracteres");

export default PasswordSchema;
