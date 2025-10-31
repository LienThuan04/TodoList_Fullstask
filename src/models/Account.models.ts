import mongoose from "mongoose";
import { trim } from "zod";

const accountSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        username: { type: String, required: true },
    },
    { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
