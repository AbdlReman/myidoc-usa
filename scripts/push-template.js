/* Force-pushes one (or all) templates from scripts/seed-data/templates.js to the
   live database, OVERWRITING whatever is currently saved — including any edits
   made from the admin panel. Use this after editing templates.js to publish a
   design change, not for routine content tweaks (do those in /admin/templates).

     node scripts/push-template.js "Welcome Email"
     node scripts/push-template.js --all

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

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/push-template.js "<template name>" | --all');
    process.exit(1);
  }

  const targets = arg === "--all" ? TEMPLATES : TEMPLATES.filter((t) => t.name === arg);
  if (targets.length === 0) {
    console.error(`No template named "${arg}" found in scripts/seed-data/templates.js. Available:`);
    TEMPLATES.forEach((t) => console.error(`  - ${t.name}`));
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "myidoc" });

  const EmailTemplateSchema = new mongoose.Schema(
    { name: String, subject: String, previewText: String, htmlBody: String, plainTextBody: String, updatedBy: String },
    { timestamps: true }
  );
  const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);

  for (const tpl of targets) {
    const result = await EmailTemplate.findOneAndUpdate(
      { name: tpl.name },
      { $set: { ...tpl, updatedBy: "Design Push" } },
      { upsert: true, new: true }
    );
    console.log(`Pushed: ${tpl.name} (${result._id})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
