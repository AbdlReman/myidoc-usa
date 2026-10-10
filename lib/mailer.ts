import nodemailer from "nodemailer";

// From name is fixed in code; from/reply-to addresses come from env — no DB-editable settings.
const FROM_NAME = "MyIDocUSA";
const REPLY_TO = process.env.EMAIL_TO || process.env.EMAIL_USER || "";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const t = getTransporter();
  if (!t) {
    console.warn("EMAIL_USER/EMAIL_PASS not configured — skipping password reset email send.");
    return;
  }

  await t.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset your MYiDocUSA password",
    text: `You requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, you can ignore this email.`,
  });
}

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  unsubscribeUrl?: string;
};

export type SendMailResult = { messageId: string };

/**
 * Generic sender for subscriber-flow emails. From name is fixed ("MyIDocUSA"),
 * from/reply-to addresses come from env vars (EMAIL_USER/EMAIL_TO). Attaches
 * List-Unsubscribe headers (CAN-SPAM / RFC 8058 one-click) when an unsubscribe
 * URL is given.
 */
export async function sendMail({ to, subject, html, text, unsubscribeUrl }: SendMailInput): Promise<SendMailResult> {
  const t = getTransporter();
  if (!t) {
    throw new Error("EMAIL_USER/EMAIL_PASS not configured — cannot send email.");
  }

  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<mailto:${REPLY_TO}>, <${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const info = await t.sendMail({
    from: `"${FROM_NAME}" <${process.env.EMAIL_USER}>`,
    replyTo: REPLY_TO || undefined,
    to,
    subject,
    html,
    text: text || undefined,
    headers,
  });

  return { messageId: info.messageId };
}
