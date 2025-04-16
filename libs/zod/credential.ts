import { z } from 'zod'

export const emailSchema = z
      .string()
      .min(1, "email should be longer")
      .email("email format is not valid");

export const passwordSchema = z
      .string()
      .min(1, "you must put a password")
      .min(8, "password must be 8 character")
      .regex(/[A-Z]/, "mast contain upper case")
      .regex(/[0-9]/, "must contain numbers");