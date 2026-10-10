/* One-off script: registers a cron-job.org job that hits /api/cron/run every
   5 minutes, using the cron-job.org REST API (https://docs.cron-job.org/rest-api.html).
   Reads from .env.local:
     CRONJOB_API_KEY       - your cron-job.org API key (Settings -> API in their dashboard)
     NEXT_PUBLIC_BASE_URL  - your PUBLIC production URL (not localhost!) e.g. https://www.myidocusa.com
     CRON_SECRET           - the secret /api/cron/run expects

   Usage:
     node scripts/setup-cronjob.js
     node scripts/setup-cronjob.js https://www.myidocusa.com   (overrides NEXT_PUBLIC_BASE_URL)
*/
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const API_KEY = process.env.CRONJOB_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const baseUrl = (process.argv[2] || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

async function main() {
  if (!API_KEY) {
    console.error("CRONJOB_API_KEY is not set in .env.local. Get one from cron-job.org -> Settings -> API.");
    process.exit(1);
  }
  if (!CRON_SECRET) {
    console.error("CRON_SECRET is not set in .env.local.");
    process.exit(1);
  }
  if (!baseUrl || baseUrl.includes("localhost")) {
    console.error(
      "No usable public URL found. cron-job.org must be able to reach your site over the internet, so " +
        "pass your real production URL: node scripts/setup-cronjob.js https://www.myidocusa.com"
    );
    process.exit(1);
  }

  const targetUrl = `${baseUrl}/api/cron/run`;

  const res = await fetch("https://api.cron-job.org/jobs", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job: {
        title: "MyIDocUSA — process subscriber email queue",
        url: targetUrl,
        enabled: true,
        saveResponses: true,
        requestMethod: 0, // GET
        requestTimeout: 30,
        schedule: {
          timezone: "UTC",
          hours: [-1],
          mdays: [-1],
          minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
          months: [-1],
          wdays: [-1],
        },
        extendedData: {
          headers: {
            Authorization: `Bearer ${CRON_SECRET}`,
          },
          body: "",
        },
        notification: {
          onFailure: true,
          onSuccess: false,
          onDisable: true,
        },
      },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`cron-job.org API returned ${res.status}:`, data);
    process.exit(1);
  }

  console.log(`Created cron-job.org job #${data.jobId}, hitting ${targetUrl} every 5 minutes.`);
  console.log("Check/manage it at https://console.cron-job.org/jobs");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
