import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FlowStep, { DELAY_UNITS } from "@/models/FlowStep";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id: flowId } = await params;
  const { templateId, delayValue, delayUnit } = await req.json();

  if (!templateId) return NextResponse.json({ error: "A template is required" }, { status: 400 });
  if (delayUnit && !DELAY_UNITS.includes(delayUnit)) {
    return NextResponse.json({ error: "Invalid delay unit" }, { status: 400 });
  }

  await connectDB();
  const lastStep = await FlowStep.findOne({ flowId }).sort({ order: -1 });
  const order = lastStep ? lastStep.order + 1 : 0;

  const step = await FlowStep.create({
    flowId,
    templateId,
    order,
    delayValue: delayValue ?? 0,
    delayUnit: delayUnit || "days",
  });

  return NextResponse.json(step, { status: 201 });
}

// Reorders steps: body { order: [stepId, stepId, ...] } in the new desired sequence.
export async function PUT(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id: flowId } = await params;
  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "order must be an array of step ids" }, { status: 400 });
  }

  await connectDB();
  await Promise.all(
    order.map((stepId: string, index: number) =>
      FlowStep.updateOne({ _id: stepId, flowId }, { $set: { order: index } })
    )
  );

  const steps = await FlowStep.find({ flowId }).sort({ order: 1 });
  return NextResponse.json(steps);
}
