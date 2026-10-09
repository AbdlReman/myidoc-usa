import mongoose, { Schema, type InferSchemaType } from "mongoose";

/** Roles: 1 = admin, 2 = doctor, 3 = patient */
export const ROLES = { ADMIN: 1, DOCTOR: 2, PATIENT: 3 } as const;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [1, 2, 3], default: 3 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.User || mongoose.model("User", UserSchema);
