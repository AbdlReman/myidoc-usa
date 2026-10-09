import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const { name, email, password, role } = await req.json();

  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (email && email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role && [1, 2, 3].includes(role)) user.role = role;
  if (password) user.password = await bcrypt.hash(password, 12);

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return NextResponse.json(userResponse);
}

export async function DELETE(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User deleted successfully" });
}
