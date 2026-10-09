/* One-off script: creates (or updates) an admin user. Run with:
     node scripts/seed-admin.js <email> <password> [name]
   Reads MONGODB_URI from .env.local. */
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Node on Windows sometimes fails SRV lookups against the system resolver; fall back to public DNS.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Minimal .env.local loader (avoids adding a dotenv dependency for a one-off script).
const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

async function main() {
  const [, , email, password, name] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/seed-admin.js <email> <password> [name]");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "myidoc" });

  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true, lowercase: true, trim: true },
      password: String,
      role: Number,
      resetPasswordToken: String,
      resetPasswordExpires: Date,
    },
    { timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const hashed = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.password = hashed;
    existing.role = 1;
    if (name) existing.name = name;
    await existing.save();
    console.log(`Updated existing user ${email} to admin with new password.`);
  } else {
    await User.create({ name: name || "Admin", email, password: hashed, role: 1 });
    console.log(`Created admin user ${email}.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
