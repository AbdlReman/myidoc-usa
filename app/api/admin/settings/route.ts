import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSettings } from "@/models/Settings";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { fromName, fromEmail, replyTo, bookingLink, footerAddress, doubleOptIn } = await req.json();

  await connectDB();
  const settings = await getSettings();

  if (fromName !== undefined) settings.fromName = fromName;
  if (fromEmail !== undefined) settings.fromEmail = fromEmail;
  if (replyTo !== undefined) settings.replyTo = replyTo;
  if (bookingLink !== undefined) settings.bookingLink = bookingLink;
  if (footerAddress !== undefined) settings.footerAddress = footerAddress;
  if (doubleOptIn !== undefined) settings.doubleOptIn = doubleOptIn;

  await settings.save();
  return NextResponse.json(settings);
}
