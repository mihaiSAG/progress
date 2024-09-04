// models.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Habit extends Document {
    name: string;
    points: number;
    lastUpdated: Date;
}

export interface User extends Document {
    id: string;
    name: string;
    pass: string;
    habits: Habit[];
}

const HabitSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    points: { type: Number, required: true },
    lastUpdated: { type: Date, required: true },
});

const UserSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pass: { type: String, required: true },
    habits: [HabitSchema],
});

export const UserModel = mongoose.model<User>("User", UserSchema);
