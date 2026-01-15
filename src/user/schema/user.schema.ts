import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true, lowercase: true, unique: true })
    userName: string

    @Prop({ required: true, trim: true, unique: true })
    email: string

    @Prop({ required: true, trim: true })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
