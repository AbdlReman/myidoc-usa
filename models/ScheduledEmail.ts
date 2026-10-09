import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const SCHEDULED_EMAIL_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
  SKIPPED: "skipped",
} as const;

export type ScheduledEmailStatus = (typeof SCHEDULED_EMAIL_STATUS)[keyof typeof SCHEDULED_EMAIL_STATUS];

const ScheduledEmailSchema = new Schema(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    flowId: { type: Schema.Types.ObjectId, ref: "EmailFlow", required: true },
    stepId: { type: Schema.Types.ObjectId, ref: "FlowStep", required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "EmailTemplate", required: true },
    scheduledFor: { type: Date, required: true },
    sentAt: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(SCHEDULED_EMAIL_STATUS),
      default: SCHEDULED_EMAIL_STATUS.PENDING,
    },
    attempts: { type: Number, default: 0 },
    providerMessageId: { type: String, default: "" },
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    openedAt: { type: Date, default: null },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

// A lead can never be queued for the same step twice — this is the idempotency guarantee.
ScheduledEmailSchema.index({ leadId: 1, stepId: 1 }, { unique: true });
ScheduledEmailSchema.index({ status: 1, scheduledFor: 1 });

export type ScheduledEmailDoc = InferSchemaType<typeof ScheduledEmailSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.ScheduledEmail || mongoose.model("ScheduledEmail", ScheduledEmailSchema);
