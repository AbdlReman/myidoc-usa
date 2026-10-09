import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailFlow from "@/models/EmailFlow";
import FlowStep from "@/models/FlowStep";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const { name, isActive, trigger } = await req.json();

  await connectDB();
  const flow = await EmailFlow.findById(id);
  if (!flow) return NextResponse.json({ error: "Flow not found" }, { status: 404 });

  if (name !== undefined) flow.name = name;
  if (isActive !== undefined) flow.isActive = isActive;
  if (trigger !== undefined) flow.trigger = trigger;
  await flow.save();

  return NextResponse.json(flow);
}

export async function DELETE(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const flow = await EmailFlow.findByIdAndDelete(id);
  if (!flow) return NextResponse.json({ error: "Flow not found" }, { status: 404 });

  await FlowStep.deleteMany({ flowId: id });
  return NextResponse.json({ message: "Flow deleted" });
}
