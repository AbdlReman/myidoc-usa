import mongoose, { Schema } from "mongoose";

// Backs the subscribe-form rate limiter. TTL index auto-expires rows after 1 hour
// so this collection self-cleans and the limiter works correctly across serverless
// invocations (an in-memory counter would reset on every cold start).
const SubscribeAttemptSchema = new Schema({
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

SubscribeAttemptSchema.index({ ip: 1, createdAt: 1 });

export default mongoose.models.SubscribeAttempt || mongoose.model("SubscribeAttempt", SubscribeAttemptSchema);
