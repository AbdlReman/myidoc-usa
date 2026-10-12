/* Shared template content, used by both scripts/seed-email-system.js (initial
   seed, never overwrites existing docs) and scripts/push-template.js (force-push
   a specific template's content to the live DB, overwriting admin edits). Keeping
   this in one file means both scripts always agree on what the "current" design is. */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const COLORS = {
  primary: "#1d4e89",
  navy: "#0f2a4a",
  text: "#1e2433",
  text2: "#4a5163",
  muted: "#6e7485",
  border: "#e8e6f0",
  tint: "#f4f3f8",
};

const DISCLAIMER =
  '<p style="font-size:13px;color:#8a8a8a;">This email is for general information only and is not a substitute for medical advice. If you are experiencing a medical emergency, call 911.</p>';

function wrap(bodyHtml) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:${COLORS.text};">
  <div style="text-align:center;padding:24px 0;">
    <img src="${BASE_URL}/images/logo.png" alt="MyIDocUSA" height="40" style="height:40px;" />
  </div>
  ${bodyHtml}
  ${DISCLAIMER}
</div>`;
}

const buttonHtml = (label, href) =>
  `<p style="text-align:center;margin:28px 0;"><a href="${href}" style="background:${COLORS.primary};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;display:inline-block;">${label}</a></p>`;

/** One row of the "4 reasons" section: a numbered circle + heading + text, alternating sides. */
function featureRow(number, title, text, circleOnRight) {
  const circleCell = `
    <td width="88" valign="top" align="center" style="padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td width="56" height="56" align="center" valign="middle" bgcolor="${COLORS.primary}"
              style="background:${COLORS.primary};border-radius:50%;font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:20px;font-weight:bold;">
            ${number}
          </td>
        </tr>
      </table>
    </td>`;
  const textCell = `
    <td valign="middle" style="padding:0 ${circleOnRight ? "20" : "0"}px 0 ${circleOnRight ? "0" : "20"}px;">
      <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-weight:bold;font-size:17px;color:${COLORS.navy};">${title}</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${COLORS.text2};">${text}</p>
    </td>`;

  return `
  <tr>
    <td style="padding:18px 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>${circleOnRight ? textCell + circleCell : circleCell + textCell}</tr>
      </table>
    </td>
  </tr>`;
}

const WELCOME_HTML = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.tint};padding:32px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">

  <tr>
    <td align="center" style="padding:30px 24px 6px;">
      <img src="${BASE_URL}/images/MYiDocUSA_logo_hd.png" alt="MyIDocUSA" width="160" style="display:block;max-width:160px;" />
    </td>
  </tr>

  <tr>
    <td align="center" bgcolor="${COLORS.navy}"
        style="background:linear-gradient(135deg,${COLORS.primary},${COLORS.navy});padding:28px 24px 0;">
      <img src="${BASE_URL}/images/doctor-raza-naqvi.png" alt="" width="200" style="display:block;max-width:200px;" />
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:36px 40px 6px;">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};">Welcome to the Community</p>
      <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:bold;font-size:28px;line-height:1.25;color:${COLORS.navy};">
        Your Health, Our Priority
      </h1>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${COLORS.text2};">
        Hi {{first_name|there}}, welcome to MyIDocUSA — we're glad you're here.
      </p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${COLORS.text2};">
        We connect you with a board-certified hematologist-oncologist for one-on-one cancer coaching and online
        consultations — real appointment time, from wherever you are in the USA.
      </p>
      <a href="{{booking_link}}"
         style="display:inline-block;padding:14px 38px;border:1.5px solid ${COLORS.primary};border-radius:999px;color:${COLORS.primary};text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
        Book An Appointment
      </a>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 40px 0;">
      <div style="border-top:1px solid ${COLORS.border};"></div>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:28px 40px 4px;">
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:${COLORS.muted};">
        What You Can Expect From Us
      </p>
    </td>
  </tr>

  ${featureRow(
    "01",
    "One-on-One Cancer Coaching",
    "Personal guidance to help you understand your diagnosis, treatment options, and what to expect at each stage.",
    false
  )}
  ${featureRow(
    "02",
    "Hematology &amp; Oncology Consultations",
    "Direct, extended virtual visits with a board-certified specialist, so your questions get real answers.",
    true
  )}
  ${featureRow(
    "03",
    "Cancer Nutrition Coaching",
    "Practical, personalized guidance on eating well during and after treatment.",
    false
  )}

  <tr>
    <td style="padding:10px 40px 0;">
      <div style="border-top:1px solid ${COLORS.border};"></div>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:30px 24px 0;">
      <img src="${BASE_URL}/images/about/about1.jpg" alt="A virtual consultation with MyIDocUSA"
           width="600" style="display:block;width:100%;max-width:600px;height:auto;" />
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:28px 40px 36px;">
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-weight:bold;font-size:19px;color:${COLORS.navy};">
        Extended Virtual Visits, Wherever You Are
      </p>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${COLORS.text2};">
        Longer appointment times than a typical office visit — no travel, no waiting room. Book on Jane App, join
        your video visit, and leave with a plan built around you.
      </p>
      <a href="{{booking_link}}"
         style="display:inline-block;background:${COLORS.navy};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
        Book An Appointment
      </a>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:22px 24px;border-top:1px solid ${COLORS.border};background:${COLORS.tint};">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">
        <a href="${BASE_URL}/about" style="color:${COLORS.muted};text-decoration:none;">About Us</a>
      </p>
      <p style="margin:0 0 10px;font-size:12px;color:${COLORS.muted};">
        <a href="${BASE_URL}/services" style="color:${COLORS.muted};text-decoration:none;">Services</a> &nbsp;·&nbsp;
        <a href="${BASE_URL}/doctors" style="color:${COLORS.muted};text-decoration:none;">Doctors</a> &nbsp;·&nbsp;
        <a href="${BASE_URL}/contact" style="color:${COLORS.muted};text-decoration:none;">Contact</a>
      </p>
      <p style="margin:0;font-size:13px;color:${COLORS.text2};">Warmly, The MyIDocUSA Team</p>
    </td>
  </tr>

</table>
</td></tr>
</table>`;

const TEMPLATES = [
  {
    name: "Welcome Email",
    subject: "Welcome to MyIDocUSA, {{first_name|there}} — Your Health, Our Priority",
    previewText: "Here's what to expect from us — and how to book your first visit.",
    htmlBody: WELCOME_HTML,
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

module.exports = { TEMPLATES, BASE_URL, COLORS, wrap, buttonHtml };
