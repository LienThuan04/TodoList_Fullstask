import { z } from 'zod';

export const CreateAccountSchema = z.object({
    username: z.string()
        .trim()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(100, { message: 'Username must be at most 100 characters long' }),

    email: z.string().trim().email({ message: 'Invalid email address' }),

    password: z.string()
        .trim()
        .min(3, { message: 'Password must be at least 3 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }).refine((val) => !/\s/.test(val), {
            message: 'Password must not contain spaces',
        }),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
