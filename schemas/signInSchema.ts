import { z } from 'zod';

export const signInSchema = z.object({
    identifier: z.string().nonempty("Email/Username is required"),
    password: z.string().nonempty("Password is required"),
});