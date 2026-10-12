/* One-off script: seeds the 4 welcome-series email templates and the
   "Subscriber Welcome Series" flow (steps at Day 0/2/5/9).
   Idempotent — safe to re-run; upserts by name instead of creating duplicates.
     node scripts/seed-email-system.js
   Reads MONGODB_URI from .env.local, same pattern as scripts/seed-admin.js. */
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const { TEMPLATES } = require("./seed-data/templates");

const STEP_DELAYS = [
  { delayValue: 0, delayUnit: "days" },
  { delayValue: 2, delayUnit: "days" },
  { delayValue: 5, delayUnit: "days" },
  { delayValue: 9, delayUnit: "days" },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "myidoc" });

  const EmailTemplateSchema = new mongoose.Schema(
    { name: String, subject: String, previewText: String, htmlBody: String, plainTextBody: String, updatedBy: String },
    { timestamps: true }
  );
  const EmailFlowSchema = new mongoose.Schema(
    { name: String, isActive: Boolean, trigger: String },
    { timestamps: true }
  );
  const FlowStepSchema = new mongoose.Schema(
    {
      flowId: mongoose.Schema.Types.ObjectId,
      order: Number,
      templateId: mongoose.Schema.Types.ObjectId,
      delayValue: Number,
      delayUnit: String,
      isActive: Boolean,
    },
    { timestamps: true }
  );
  const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
  const EmailFlow = mongoose.models.EmailFlow || mongoose.model("EmailFlow", EmailFlowSchema);
  const FlowStep = mongoose.models.FlowStep || mongoose.model("FlowStep", FlowStepSchema);

  // Templates (upsert by name)
  const templateIds = [];
  for (const tpl of TEMPLATES) {
    const doc = await EmailTemplate.findOneAndUpdate(
      { name: tpl.name },
      { $setOnInsert: { ...tpl, updatedBy: "Seed Script" } },
      { upsert: true, new: true }
    );
    templateIds.push(doc._id);
    console.log(`Template ready: ${tpl.name}`);
  }

  // Flow (upsert by name)
  let flow = await EmailFlow.findOne({ name: "Subscriber Welcome Series" });
  if (!flow) {
    flow = await EmailFlow.create({ name: "Subscriber Welcome Series", isActive: true, trigger: "on_subscribe" });
    console.log("Created flow: Subscriber Welcome Series");
  } else {
    console.log("Flow already exists — left unchanged.");
  }

  // Steps (one per template, in order, only created if this flow has no steps yet)
  const existingStepCount = await FlowStep.countDocuments({ flowId: flow._id });
  if (existingStepCount === 0) {
    for (let i = 0; i < templateIds.length; i++) {
      await FlowStep.create({
        flowId: flow._id,
        order: i,
        templateId: templateIds[i],
        delayValue: STEP_DELAYS[i].delayValue,
        delayUnit: STEP_DELAYS[i].delayUnit,
        isActive: true,
      });
    }
    console.log(`Created ${templateIds.length} flow steps.`);
  } else {
    console.log(`Flow already has ${existingStepCount} step(s) — left unchanged.`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
