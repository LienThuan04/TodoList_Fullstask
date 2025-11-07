"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetImgAvatarAccount = exports.setAvatar = exports.GetInfoAccount = exports.LoginAccount = exports.CreateAccount = void 0;
const account_service_1 = require("services/account.service");
const Accounts_schema_1 = require("validation/Accounts.schema");
const CreateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateAccount = yield Accounts_schema_1.CreateAccountSchema.safeParseAsync(req.body);
        if (!validateAccount.success) {
            const errorZod = validateAccount.error.issues; // extract validation issues from Zod error
            const errors = errorZod.map((err) => `${err.message} (${err.path.join('.')})`); // format errors
            return res.status(400).json({ message: 'Validation errors', errors });
        }
        const { username, email, password } = validateAccount.data; // validated data
        const existingAccount = yield (0, account_service_1.isEmailExist)(email);
        if (existingAccount) {
            return res.status(409).json({ message: "Email already exists" });
        }
        ;
        const newAccount = yield (0, account_service_1.CreateAccountService)(username, email, password);
        if (!newAccount) {
            throw new Error("Account creation failed");
        }
        res.status(201).json({ message: "Account created successfully", data: newAccount });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating account", error: error });
    }
});
exports.CreateAccount = CreateAccount;
const LoginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateLogin = yield Accounts_schema_1.LoginAccountSchema.safeParseAsync(req.body);
        if (!validateLogin.success) {
            const errorZod = validateLogin.error.issues; // extract validation issues from Zod error
            const errors = errorZod.map((err) => `${err.message} (${err.path.join('.')})`); // format errors
            return res.status(400).json({ message: 'Validation errors', errors });
        }
        const { email, password } = validateLogin.data; // validated database
        const isEmailExistAccount = yield (0, account_service_1.isEmailExist)(email);
        if (!isEmailExistAccount) {
            return res.status(404).json({ message: "Email does not exist" });
        }
        ;
        const accessToken = yield (0, account_service_1.LoginAccountService)(email, password);
        if (!accessToken) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ message: "Login successful", data: { AccessToken: accessToken } });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Error during login", error: error.message });
    }
});
exports.LoginAccount = LoginAccount;
const GetInfoAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // console.log("Retrieved user info:", user);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information not found" });
        }
        return res.status(200).json({ message: "User info retrieved successfully", data: user });
    }
    catch (error) {
        console.error("Error retrieving user info:", error);
        return res.status(500).json({ message: "Error retrieving user info", error: error.message });
    }
});
exports.GetInfoAccount = GetInfoAccount;
const setAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information not found" });
        }
        // Here you would typically handle the avatar upload and update the user's profile
        // For demonstration, we'll just return a success message
        const avatarPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename; // Assuming file upload middleware sets req.file
        if (!avatarPath) {
            return res.status(400).json({ message: "No avatar file uploaded" });
        }
        // Update the user's avatar in the database
        const updatedAccount = yield (0, account_service_1.setAvatarForAccount)(user.id, avatarPath);
        if (!updatedAccount) {
            throw new Error("Failed to set avatar");
        }
        return res.status(200).json({ message: "Avatar set successfully", data: updatedAccount });
    }
    catch (error) {
        console.error("Error setting avatar:", error);
        return res.status(500).json({ message: "Error setting avatar", error: error.message });
    }
});
exports.setAvatar = setAvatar;
const GetImgAvatarAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information not found" });
        }
        const avatar = yield (0, account_service_1.getAvatarOfAccount)(user.id);
        if (!avatar) {
            return res.status(404).json({ message: "Avatar not found" });
        }
        return res.status(200).json({ message: "Avatar retrieved successfully", data: { avatar: avatar } });
    }
    catch (error) {
        console.error("Error retrieving avatar:", error);
        return res.status(500).json({ message: "Error retrieving avatar", error: error.message });
    }
});
exports.GetImgAvatarAccount = GetImgAvatarAccount;
//# sourceMappingURL=accounts.controller.js.map