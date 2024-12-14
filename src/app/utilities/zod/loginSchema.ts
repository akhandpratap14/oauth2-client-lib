import { z } from "zod";

export const LoginFormDataSchema = z.object({
  email: z.string().min(1, "email is required").email("Invalid email address"),
  password: z.string().min(1, "password is required"),
});
