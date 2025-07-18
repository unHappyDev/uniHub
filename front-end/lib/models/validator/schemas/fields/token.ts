import { z } from "zod";

const TokenSchema = z.string().uuid().trim();

export default TokenSchema;
