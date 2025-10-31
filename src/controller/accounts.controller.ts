import type { Request, Response } from "express";
import Account from "models/Account.models";
import { CreateAccountInput, CreateAccountSchema } from "validation/Accounts.schema";

export const CreateAccount = async (req: Request, res: Response) => {
    try {
        // validate request body using Zod (safeParseAsync returns { success, data } or { success, error })
        const validateAccount = await CreateAccountSchema.safeParseAsync(req.body);
        if (!validateAccount.success) {
            const errorZod = validateAccount.error.issues;
            const errors = errorZod.map((err) => `${err.message} (${err.path.join('.')})`);
            return res.status(400).json({ message: 'Validation errors', errors });
        }
        const { username, email, password } = validateAccount.data as CreateAccountInput;
        const newAccount = new Account({ username, email, password });
        const savedAccount = await newAccount.save();
        res.status(201).json({ message: "Account created successfully", data: savedAccount });
    } catch (error: any) {
        return res.status(500).json({ message: "Error creating account", error: error });
    }
};