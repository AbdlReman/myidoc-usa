import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    fromName: { type: String, default: "MyIDocUSA" },
    fromEmail: { type: String, default: "admin@myidocusa.com" },
    replyTo: { type: String, default: "admin@myidocusa.com" },
    bookingLink: { type: String, default: "https://myidocusa.janeapp.com/" },
    footerAddress: { type: String, default: "" },
    doubleOptIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & { _id: mongoose.Types.ObjectId };

const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export default SettingsModel;

/** There is only ever one Settings document — fetch it (creating defaults on first use). */
export async function getSettings() {
  let doc = await SettingsModel.findOne();
  if (!doc) {
    doc = await SettingsModel.create({});
  }
  return doc;
}
