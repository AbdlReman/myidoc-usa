import mongoose, { Schema, type InferSchemaType } from "mongoose";
import crypto from "crypto";

export const LEAD_STATUS = {
  ACTIVE: "active",
  UNSUBSCRIBED: "unsubscribed",
  BOUNCED: "bounced",
  COMPLETED: "completed",
  PENDING_CONFIRMATION: "pending_confirmation",
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

const LeadSchema = new Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    audienceType: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "" },
    utmSource: { type: String, trim: true, default: "" },
    utmMedium: { type: String, trim: true, default: "" },
    utmCampaign: { type: String, trim: true, default: "" },
    utmTerm: { type: String, trim: true, default: "" },
    utmContent: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.ACTIVE,
    },
    tags: { type: [String], default: [] },
    unsubscribeToken: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(24).toString("hex"),
    },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

export type LeadDoc = InferSchemaType<typeof LeadSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
