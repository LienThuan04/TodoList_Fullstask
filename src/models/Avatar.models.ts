import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',// Reference to the Account model
            required: true,
            unique: true,
            index: true,// Ensure one avatar per account
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Avatar = mongoose.model("Avatar", avatarSchema);

export default Avatar;