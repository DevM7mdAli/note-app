import { z } from "zod";
import { emailSchema, passwordSchema } from "./credential";


export const signInSchema = z.object({
      email: emailSchema,
      password: passwordSchema
});