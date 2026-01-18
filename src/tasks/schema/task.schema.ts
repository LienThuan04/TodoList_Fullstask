import { User } from "@/users/schema/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type TaskDocument = HydratedDocument<Task>;
@Schema({ timestamps: true })
export class Task {
    @Prop({ type: Types.ObjectId, required: true, trim: true, ref: User.name })
    ownerId: Types.ObjectId

    @Prop({ type: String, required: true, maxlength: 100 })
    title: string

    @Prop({ type: String, maxlength: 500, default: null })
    description: string | null

    @Prop({ enum: ['active', 'pending', 'in-progress', 'completed'], default: 'pending', type: String })
    status?: 'active' | 'pending' | 'in-progress' | 'completed'

    @Prop({ type: Date, default: null })
    completedAt?: Date | null
}
export const TaskSchema = SchemaFactory.createForClass(Task);
