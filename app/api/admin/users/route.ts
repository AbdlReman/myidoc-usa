import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User, { ROLES } from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();
  const users = await User.find({}, "-password").sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }
  if (role && ![1, 2, 3].includes(role)) {
    return NextResponse.json({ error: "Invalid role. Must be 1 (admin), 2 (doctor), or 3 (patient)" }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, role: role || ROLES.PATIENT });

  const userResponse = user.toObject();
  delete userResponse.password;

  return NextResponse.json(userResponse, { status: 201 });
}
