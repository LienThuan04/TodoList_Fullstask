import { z } from 'zod';

export const CreateAccountSchema = z.object({
    username: z.string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(100, { message: 'Username must be at most 100 characters long' }),

    email: z.string().trim().email({ message: 'Invalid email address' }),

    password: z.string()
        .trim()
        .min(3, { message: 'Password must be at least 3 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }).refine((val) => !/\s/.test(val), { // no spaces allowed
            message: 'Password must not contain spaces',
        }),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
// New schema for login
export const LoginAccountSchema = z.object({
    email: z.string().trim().email({ message: 'Invalid email address' }),
    password: z.string().trim().min(3, { message: 'Password must be at least 3 characters long' }).max(100, { message: 'Password must be at most 100 characters long' }).refine((val) => !/\s/.test(val), { // no spaces allowed
        message: 'Password must not contain spaces',
    }),
});

export type LoginAccountInput = z.infer<typeof LoginAccountSchema>;