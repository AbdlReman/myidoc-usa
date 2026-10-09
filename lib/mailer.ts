import nodemailer from "nodemailer";
import { getSettings } from "@/models/Settings";

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
 * Generic sender for subscriber-flow emails. Pulls From/Reply-To from the
 * editable Settings doc, and attaches List-Unsubscribe headers (CAN-SPAM /
 * RFC 8058 one-click) when an unsubscribe URL is given.
 */
export async function sendMail({ to, subject, html, text, unsubscribeUrl }: SendMailInput): Promise<SendMailResult> {
  const t = getTransporter();
  if (!t) {
    throw new Error("EMAIL_USER/EMAIL_PASS not configured — cannot send email.");
  }

  const settings = await getSettings();
  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<mailto:${settings.replyTo}>, <${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const info = await t.sendMail({
    from: `"${settings.fromName}" <${process.env.EMAIL_USER}>`,
    replyTo: settings.replyTo || undefined,
    to,
    subject,
    html,
    text: text || undefined,
    headers,
  });

  return { messageId: info.messageId };
}
