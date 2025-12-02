import z from "zod";

export const SignupSchema = z.object({
  email: z.string().min(2),
  password: z.string().min(8),
});
