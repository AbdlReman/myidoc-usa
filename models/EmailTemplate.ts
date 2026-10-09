import mongoose, { Schema, type InferSchemaType } from "mongoose";

const EmailTemplateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    previewText: { type: String, trim: true, default: "" },
    htmlBody: { type: String, required: true, default: "" },
    plainTextBody: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export type EmailTemplateDoc = InferSchemaType<typeof EmailTemplateSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
