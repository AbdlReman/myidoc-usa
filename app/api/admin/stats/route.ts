import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import ScheduledEmail, { SCHEDULED_EMAIL_STATUS } from "@/models/ScheduledEmail";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 29 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    newToday,
    newThisWeek,
    activeCount,
    unsubscribedCount,
    sentCount,
    openedCount,
    clickedCount,
    signupsRaw,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
    Lead.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Lead.countDocuments({ status: LEAD_STATUS.ACTIVE }),
    Lead.countDocuments({ status: LEAD_STATUS.UNSUBSCRIBED }),
    ScheduledEmail.countDocuments({ status: SCHEDULED_EMAIL_STATUS.SENT }),
    ScheduledEmail.countDocuments({ status: SCHEDULED_EMAIL_STATUS.SENT, opens: { $gt: 0 } }),
    ScheduledEmail.countDocuments({ status: SCHEDULED_EMAIL_STATUS.SENT, clicks: { $gt: 0 } }),
    Lead.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const signupsByDay = new Map(signupsRaw.map((d: { _id: string; count: number }) => [d._id, d.count]));
  const signupsOverTime: { date: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    signupsOverTime.push({ date: key, count: signupsByDay.get(key) || 0 });
  }

  return NextResponse.json({
    totalLeads,
    newToday,
    newThisWeek,
    activeCount,
    unsubscribedCount,
    sentCount,
    openRate: sentCount > 0 ? openedCount / sentCount : 0,
    clickRate: sentCount > 0 ? clickedCount / sentCount : 0,
    signupsOverTime,
  });
}
