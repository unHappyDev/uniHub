import { z } from "zod";

const SessionIdSchema = z
  .string()
  .length(96, "Session ID must be exactly 96 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Session ID must be alphanumeric")
  .transform((val) => val.trim());

export default SessionIdSchema;
