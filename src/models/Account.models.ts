import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        username: { type: String, required: true },
        // Avatar path or URL stored on the Account document
        avatar: { type: String, default: null },
    },
    { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
