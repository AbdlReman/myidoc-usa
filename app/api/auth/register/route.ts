import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User, { ROLES } from "@/models/User";

// Public self-registration. Always creates a patient account — admins/doctors
// are created separately from the admin dashboard, never from client input here.
export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: ROLES.PATIENT,
  });

  return NextResponse.json({ name: user.name, email: user.email }, { status: 201 });
}
