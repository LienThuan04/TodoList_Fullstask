"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAccountSchema = exports.CreateAccountSchema = void 0;
const zod_1 = require("zod");
exports.CreateAccountSchema = zod_1.z.object({
    username: zod_1.z.string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(100, { message: 'Username must be at most 100 characters long' }),
    email: zod_1.z.string().trim().email({ message: 'Invalid email address' }),
    password: zod_1.z.string()
        .trim()
        .min(3, { message: 'Password must be at least 3 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }).refine((val) => !/\s/.test(val), {
        message: 'Password must not contain spaces',
    }),
});
// New schema for login
exports.LoginAccountSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email({ message: 'Invalid email address' }),
    password: zod_1.z.string().trim().min(3, { message: 'Password must be at least 3 characters long' }).max(100, { message: 'Password must be at most 100 characters long' }).refine((val) => !/\s/.test(val), {
        message: 'Password must not contain spaces',
    }),
});
//# sourceMappingURL=Accounts.schema.js.map