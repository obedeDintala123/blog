import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characteres" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characteres" }),
});
