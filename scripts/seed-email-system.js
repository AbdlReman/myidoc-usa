/* One-off script: seeds the default Settings doc, the 4 welcome-series email
   templates, and the "Subscriber Welcome Series" flow (steps at Day 0/2/5/9).
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const DISCLAIMER =
  "<p style=\"font-size:13px;color:#8a8a8a;\">This email is for general information only and is not a substitute for medical advice. If you are experiencing a medical emergency, call 911.</p>";

function wrap(bodyHtml) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1e2433;">
  <div style="text-align:center;padding:24px 0;">
    <img src="${BASE_URL}/images/logo.png" alt="MyIDocUSA" height="40" style="height:40px;" />
  </div>
  ${bodyHtml}
  ${DISCLAIMER}
</div>`;
}

const buttonHtml = (label, href) =>
  `<p style="text-align:center;margin:28px 0;"><a href="${href}" style="background:#1d4e89;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;display:inline-block;">${label}</a></p>`;

const TEMPLATES = [
  {
    name: "Welcome Email",
    subject: "Welcome to MyIDocUSA, {{first_name|there}}",
    previewText: "Here's what to expect from us — and how to book your first visit.",
    htmlBody: wrap(`
      <p>Hi {{first_name|there}},</p>
      <p>Welcome to MyIDocUSA — thank you for subscribing. We're glad you're here.</p>
      <p>
        MyIDocUSA connects you with a board-certified hematologist-oncologist for one-on-one cancer coaching and
        online hematology/oncology consultations — from wherever you are in the USA. Our visits run longer than a
        typical office visit, so there's real time for your questions, your records, and a plan that makes sense
        for you. We also offer cancer nutrition coaching to support you through treatment and recovery.
      </p>
      <p>Over the next couple of weeks, you'll hear a bit more from us about:</p>
      <ul>
        <li>How a virtual consultation actually works, step by step</li>
        <li>Nutrition and wellbeing support during cancer care</li>
        <li>Answers to the questions we hear most often</li>
      </ul>
      <p>If you'd like to get started right away, you're welcome to book a visit whenever you're ready.</p>
      ${buttonHtml("Book An Appointment", "{{booking_link}}")}
      <p>Warmly,<br />The MyIDocUSA Team</p>
    `),
    plainTextBody: "",
  },
  {
    name: "Day 2 — How MyIDocUSA Can Help You",
    subject: "How MyIDocUSA can help you",
    previewText: "A closer look at cancer coaching, consultations, and nutrition support.",
    htmlBody: wrap(`
      <p>Hi {{first_name|there}},</p>
      <p>We wanted to share a bit more about how MyIDocUSA can support you or someone you love:</p>
      <ul>
        <li>
          <strong>One-on-one cancer coaching</strong> — personal guidance to help you understand your diagnosis,
          treatment options, and what to expect at each stage.
        </li>
        <li>
          <strong>Online hematology &amp; oncology consultations</strong> — direct, extended virtual visits with a
          board-certified hematologist-oncologist, so your questions get real answers.
        </li>
        <li>
          <strong>Cancer nutrition coaching</strong> — practical, personalized guidance on eating well during and
          after treatment.
        </li>
        <li>
          <strong>Extended virtual visits across the USA</strong> — longer appointment times than a typical office
          visit, from wherever you're most comfortable.
        </li>
      </ul>
      <p>Whenever you're ready, booking a visit takes just a couple of minutes.</p>
      ${buttonHtml("Book An Appointment", "{{booking_link}}")}
      <p>Warmly,<br />The MyIDocUSA Team</p>
    `),
    plainTextBody: "",
  },
  {
    name: "Day 5 — Nutrition & Wellbeing During Cancer Care",
    subject: "Nutrition & wellbeing during cancer care",
    previewText: "Why nutrition matters during treatment — and how a visit works, step by step.",
    htmlBody: wrap(`
      <p>Hi {{first_name|there}},</p>
      <p>
        Good nutrition can make a real difference in how you feel during cancer treatment — supporting your energy,
        your immune system, and your ability to tolerate treatment side effects. Our cancer nutrition coaching
        focuses on practical, realistic changes tailored to your diagnosis, treatment plan, and day-to-day life —
        not generic advice.
      </p>
      <p>Curious how a consultation actually works? Here's the simple version:</p>
      <ol>
        <li><strong>Book your visit</strong> on our scheduling page.</li>
        <li><strong>Join your virtual visit</strong> from home, on video, at your scheduled time.</li>
        <li><strong>Walk away with a personalized plan</strong> built around your specific situation and goals.</li>
      </ol>
      <p>That's it — no waiting rooms, no rushed 10-minute visits.</p>
      ${buttonHtml("Book An Appointment", "{{booking_link}}")}
      <p>Warmly,<br />The MyIDocUSA Team</p>
    `),
    plainTextBody: "",
  },
  {
    name: "Day 9 — Ready to Talk to an Expert?",
    subject: "Ready to talk to an expert?",
    previewText: "Answers to the questions we hear most, and how to get started.",
    htmlBody: wrap(`
      <p>Hi {{first_name|there}},</p>
      <p>A few questions we hear often — in case they're on your mind too:</p>
      <p><strong>Who is this for?</strong><br />
      Anyone looking for a cancer coach, a second opinion, or a hematology/oncology consultation with more time and
      direct access to a specialist.</p>
      <p><strong>What states do you serve?</strong><br />
      We offer virtual visits across the USA. If you have questions about availability in your state, just ask when
      you book.</p>
      <p><strong>How do virtual visits work?</strong><br />
      You'll join a secure video visit from your phone or computer, at your scheduled time — no travel required.</p>
      <p><strong>What should I prepare?</strong><br />
      Any recent records, a list of your current medications, and the questions that matter most to you. We'll take
      it from there.</p>
      <p>If you're ready, we'd love to meet you.</p>
      ${buttonHtml("Book An Appointment", "{{booking_link}}")}
      <p>Warmly,<br />The MyIDocUSA Team</p>
    `),
    plainTextBody: "",
  },
];

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
  const SettingsSchema = new mongoose.Schema(
    { fromName: String, fromEmail: String, replyTo: String, bookingLink: String, footerAddress: String, doubleOptIn: Boolean },
    { timestamps: true }
  );

  const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
  const EmailFlow = mongoose.models.EmailFlow || mongoose.model("EmailFlow", EmailFlowSchema);
  const FlowStep = mongoose.models.FlowStep || mongoose.model("FlowStep", FlowStepSchema);
  const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

  // Settings singleton
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      fromName: "MyIDocUSA",
      fromEmail: "admin@myidocusa.com",
      replyTo: "admin@myidocusa.com",
      bookingLink: "https://myidocusa.janeapp.com/",
      footerAddress: "MYiDocUSA, 501 S Cherry St, Suite 1100, Denver, CO 80246",
      doubleOptIn: false,
    });
    console.log("Created default Settings.");
  } else {
    console.log("Settings already exist — left unchanged.");
  }

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
