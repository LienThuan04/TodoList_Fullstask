import Account from "models/Account.models";
import { comparePassword, hashPassword } from "./hashPassword.service";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const isEmailExist = async (email: string): Promise<boolean> => {
    const count = await Account.countDocuments({ email }); // count documents matching the email query have exist or not
    return count > 0; // if count > 0, email exists return true else count === 0 not return false
};

export const CreateAccountService = async (username: string, email: string, password: string) => {
    const passwordHash = await hashPassword(password); // In a real application, hash the password before storing it
    const newAccount = new Account({ username, email, password: passwordHash });
    return await newAccount.save();
};

export const LoginAccountService = async (email: string, password: string) => {
    const account = await Account.findOne({ email });
    if (!account) {
        throw new Error("Account not found");
    }
    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const payload = {
        id: account._id,
        email: account.email,
        username: account.username,
    };
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    const expiresIn: any = process.env.JWT_EXPIRES_IN;
    const accessToken = jwt.sign(payload, secretKey, { expiresIn });

    return accessToken;
};

export const setAvatarForAccount = async (userId: string, avatarPath: string) => {
    const updatedAccount = await Account.findByIdAndUpdate(
        userId,
        { avatar: avatarPath },
        { new: true } // Return the updated document
    );
    return updatedAccount;
};

export const getAvatarOfAccount = async (userId: string) => {
    const account = await Account.findById(userId).select('avatar');
    return account ? account.avatar : null;
};