"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    username: { type: String, required: true },
    // Avatar path or URL stored on the Account document
    avatar: { type: String, default: null },
}, { timestamps: true });
const Account = mongoose_1.default.model("Account", accountSchema);
exports.default = Account;
//# sourceMappingURL=Account.models.js.map