import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FlowStep, { DELAY_UNITS } from "@/models/FlowStep";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string; stepId: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id: flowId, stepId } = await params;
  const { templateId, delayValue, delayUnit, isActive } = await req.json();

  if (delayUnit && !DELAY_UNITS.includes(delayUnit)) {
    return NextResponse.json({ error: "Invalid delay unit" }, { status: 400 });
  }

  await connectDB();
  const step = await FlowStep.findOne({ _id: stepId, flowId });
  if (!step) return NextResponse.json({ error: "Step not found" }, { status: 404 });

  if (templateId !== undefined) step.templateId = templateId;
  if (delayValue !== undefined) step.delayValue = delayValue;
  if (delayUnit !== undefined) step.delayUnit = delayUnit;
  if (isActive !== undefined) step.isActive = isActive;

  await step.save();
  return NextResponse.json(step);
}

export async function DELETE(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id: flowId, stepId } = await params;
  await connectDB();

  const step = await FlowStep.findOneAndDelete({ _id: stepId, flowId });
  if (!step) return NextResponse.json({ error: "Step not found" }, { status: 404 });

  return NextResponse.json({ message: "Step deleted" });
}
