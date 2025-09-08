import { z } from "zod";

const EmailSchema = z
  .string()
  .email("Endereço de e-mail inválido")
  .transform((val) => val.toLowerCase().trim());

export default EmailSchema;
