import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const DELAY_UNITS = ["minutes", "hours", "days"] as const;
export type DelayUnit = (typeof DELAY_UNITS)[number];

const FlowStepSchema = new Schema(
  {
    flowId: { type: Schema.Types.ObjectId, ref: "EmailFlow", required: true },
    order: { type: Number, required: true, default: 0 },
    templateId: { type: Schema.Types.ObjectId, ref: "EmailTemplate", required: true },
    delayValue: { type: Number, required: true, default: 0 },
    delayUnit: { type: String, enum: DELAY_UNITS, default: "days" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FlowStepSchema.index({ flowId: 1, order: 1 });

export function delayToMs(delayValue: number, delayUnit: DelayUnit): number {
  const perUnit: Record<DelayUnit, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return delayValue * perUnit[delayUnit];
}

export type FlowStepDoc = InferSchemaType<typeof FlowStepSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.FlowStep || mongoose.model("FlowStep", FlowStepSchema);
