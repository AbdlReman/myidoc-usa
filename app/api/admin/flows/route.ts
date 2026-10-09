import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailFlow from "@/models/EmailFlow";
import FlowStep from "@/models/FlowStep";
import EmailTemplate from "@/models/EmailTemplate";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();

  const flows = await EmailFlow.find().sort({ createdAt: 1 });
  const flowsWithSteps = await Promise.all(
    flows.map(async (flow) => {
      const steps = await FlowStep.find({ flowId: flow._id }).sort({ order: 1 });
      const templateIds = steps.map((s) => s.templateId);
      const templates = await EmailTemplate.find({ _id: { $in: templateIds } }, "name subject");
      const templateMap = new Map(templates.map((t) => [t._id.toString(), t]));
      return {
        ...flow.toObject(),
        steps: steps.map((s) => ({
          ...s.toObject(),
          template: templateMap.get(s.templateId.toString()) || null,
        })),
      };
    })
  );

  return NextResponse.json(flowsWithSteps);
}

export async function POST(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { name, trigger } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  await connectDB();
  const flow = await EmailFlow.create({ name, trigger: trigger || "on_subscribe" });
  return NextResponse.json({ ...flow.toObject(), steps: [] }, { status: 201 });
}
