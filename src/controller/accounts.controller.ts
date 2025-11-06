import type { Request, Response } from "express";
import { CreateAccountService, isEmailExist, LoginAccountService, setAvatarForAccount } from "services/account.service";
import { CreateAccountInput, CreateAccountSchema, LoginAccountInput, LoginAccountSchema } from "validation/Accounts.schema";

export const CreateAccount = async (req: Request, res: Response) => {
    try {
        const validateAccount = await CreateAccountSchema.safeParseAsync(req.body);
        if (!validateAccount.success) {
            const errorZod = validateAccount.error.issues; // extract validation issues from Zod error
            const errors = errorZod.map((err) => `${err.message} (${err.path.join('.')})`); // format errors
            return res.status(400).json({ message: 'Validation errors', errors });
        }
        const { username, email, password } = validateAccount.data as CreateAccountInput; // validated data
        const existingAccount = await isEmailExist(email);
        if (existingAccount) {
            return res.status(409).json({ message: "Email already exists" });
        };
        const newAccount = await CreateAccountService(username, email, password);
        if (!newAccount) {
            throw new Error("Account creation failed");
        }
        res.status(201).json({ message: "Account created successfully", data: newAccount });
    } catch (error: any) {
        return res.status(500).json({ message: "Error creating account", error: error });
    }
};

export const LoginAccount = async (req: Request, res: Response) => {
    try {
        const validateLogin = await LoginAccountSchema.safeParseAsync(req.body);
        if (!validateLogin.success) {
            const errorZod = validateLogin.error.issues; // extract validation issues from Zod error
            const errors = errorZod.map((err) => `${err.message} (${err.path.join('.')})`); // format errors
            return res.status(400).json({ message: 'Validation errors', errors });
        }
        const { email, password } = validateLogin.data as LoginAccountInput; // validated database
        const isEmailExistAccount = await isEmailExist(email);
        if (!isEmailExistAccount) {
            return res.status(404).json({ message: "Email does not exist" });
        };
        const accessToken = await LoginAccountService(email, password);
        if (!accessToken) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ message: "Login successful", data: { AccessToken: accessToken } });
    } catch (error: any) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Error during login", error: error.message });
    }
};


export const GetInfoAccount = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        // console.log("Retrieved user info:", user);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information not found" });
        }
        return res.status(200).json({ message: "User info retrieved successfully", data: user });
    } catch (error: any) {
        console.error("Error retrieving user info:", error);
        return res.status(500).json({ message: "Error retrieving user info", error: error.message });
    }
};


export const setAvatar = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information not found" });
        }
        // Here you would typically handle the avatar upload and update the user's profile
        // For demonstration, we'll just return a success message
        const avatarPath = req.file?.filename; // Assuming file upload middleware sets req.file
        if (!avatarPath) {
            return res.status(400).json({ message: "No avatar file uploaded" });
        }
        // Update the user's avatar in the database
        const updatedAccount = await setAvatarForAccount(user.id, avatarPath);
        if (!updatedAccount) {
            throw new Error("Failed to set avatar");
        }
        return res.status(200).json({ message: "Avatar set successfully", data: updatedAccount });
    } catch (error: any) {
        console.error("Error setting avatar:", error);
        return res.status(500).json({ message: "Error setting avatar", error: error.message });
    }
};