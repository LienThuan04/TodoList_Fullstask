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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarOfAccount = exports.setAvatarForAccount = exports.LoginAccountService = exports.CreateAccountService = exports.isEmailExist = void 0;
const Account_models_1 = __importDefault(require("models/Account.models"));
const hashPassword_service_1 = require("./hashPassword.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const isEmailExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield Account_models_1.default.countDocuments({ email }); // count documents matching the email query have exist or not
    return count > 0; // if count > 0, email exists return true else count === 0 not return false
});
exports.isEmailExist = isEmailExist;
const CreateAccountService = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield (0, hashPassword_service_1.hashPassword)(password); // In a real application, hash the password before storing it
    const newAccount = new Account_models_1.default({ username, email, password: passwordHash });
    return yield newAccount.save();
});
exports.CreateAccountService = CreateAccountService;
const LoginAccountService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_models_1.default.findOne({ email });
    if (!account) {
        throw new Error("Account not found");
    }
    const isPasswordValid = yield (0, hashPassword_service_1.comparePassword)(password, account.password);
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
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const accessToken = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn });
    return accessToken;
});
exports.LoginAccountService = LoginAccountService;
const setAvatarForAccount = (userId, avatarPath) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedAccount = yield Account_models_1.default.findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true } // Return the updated document
    );
    return updatedAccount;
});
exports.setAvatarForAccount = setAvatarForAccount;
const getAvatarOfAccount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_models_1.default.findById(userId).select('avatar');
    return account ? account.avatar : null;
});
exports.getAvatarOfAccount = getAvatarOfAccount;
//# sourceMappingURL=account.service.js.map