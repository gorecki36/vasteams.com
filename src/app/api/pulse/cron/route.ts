import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const admin = createAdminSupabaseClient();
  const resend = new Resend(resendKey);

  // Get today's day of week (0=Sunday, 1=Monday, etc.)
  const today = new Date().getUTCDay();

  // Get all users who want reminders on this day
  const { data: prefs, error: prefsError } = await admin
    .from("user_preferences")
    .select("email, reminder_day")
    .eq("reminder_day", today);

  if (prefsError) {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }

  // Also get users who have submitted before but have no preference (default to Monday)
  let defaultUsers: string[] = [];
  if (today === 1) {
    const { data: allResponses } = await admin
      .from("responses")
      .select("user_id");

    const allEmails = [...new Set((allResponses ?? []).map((r) => r.user_id))];
    const prefEmails = new Set((prefs ?? []).map((p) => p.email));
    defaultUsers = allEmails.filter((e) => !prefEmails.has(e));
  }

  const recipients = [
    ...(prefs ?? []).map((p) => p.email),
    ...defaultUsers,
  ];

  let sent = 0;
  let failed = 0;

  for (const email of recipients) {
    try {
      await resend.emails.send({
        from: "The Pulse <pulse@vasteams.com>",
        to: email,
        subject: "Your weekly AI pulse check-in is ready",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #faf9f5;">
            <h1 style="font-size: 24px; color: #18181b; margin-bottom: 4px; font-weight: 700;">The Pulse</h1>
            <p style="font-size: 14px; color: #71717a; margin-top: 0; margin-bottom: 28px;">Weekly check-in</p>

            <p style="font-size: 16px; color: #3f3f46; line-height: 1.6; margin-bottom: 8px;">
              How did AI shape your thinking, work, and growth this week?
            </p>
            <p style="font-size: 16px; color: #3f3f46; line-height: 1.6; margin-bottom: 28px;">
              7 questions. Under a minute. Your trends are waiting.
            </p>

            <a href="https://vasteams.com/pulse"
               style="display: inline-block; padding: 14px 28px; background: #18181b; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; border-radius: 8px;">
              Take this week's check-in &rarr;
            </a>

            <p style="font-size: 12px; color: #a1a1aa; margin-top: 32px; line-height: 1.5;">
              You're receiving this because you signed up for The Pulse at vasteams.com.<br/>
              To change your reminder day, visit <a href="https://vasteams.com/pulse" style="color: #71717a;">vasteams.com/pulse</a>.
            </p>
          </div>
        `,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ sent, failed, total: recipients.length });
}
