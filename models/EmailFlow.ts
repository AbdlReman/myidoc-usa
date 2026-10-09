import mongoose, { Schema, type InferSchemaType } from "mongoose";

const EmailFlowSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    trigger: { type: String, default: "on_subscribe" },
  },
  { timestamps: true }
);

export type EmailFlowDoc = InferSchemaType<typeof EmailFlowSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.EmailFlow || mongoose.model("EmailFlow", EmailFlowSchema);
