import bcrypt from "bcrypt";
import "dotenv/config";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10); // Default to 10 if not set

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt with the specified rounds
    if (!password) {
        throw new Error("Password is required for hashing");
    }
    return await bcrypt.hash(password, salt); // Hash the password with the generated salt
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword); // Compare the plain password with the hashed password
}