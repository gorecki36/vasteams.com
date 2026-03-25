import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets Authorization header for cron jobs)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  const admin = createAdminSupabaseClient();
  const resend = new Resend(resendKey);

  // List all users with reminder_enabled in metadata
  const {
    data: { users },
    error: listError,
  } = await admin.auth.admin.listUsers({ perPage: 1000 });

  if (listError) {
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }

  const eligibleUsers = (users ?? []).filter(
    (u) => u.user_metadata?.reminder_enabled !== false
  );

  let sent = 0;
  let failed = 0;

  for (const user of eligibleUsers) {
    if (!user.email) continue;

    try {
      // Generate a magic link for direct survey access
      const { data: linkData, error: linkError } =
        await admin.auth.admin.generateLink({
          type: "magiclink",
          email: user.email,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vasteams.com"}/pulse/survey`,
          },
        });

      if (linkError || !linkData?.properties?.action_link) {
        failed++;
        continue;
      }

      await resend.emails.send({
        from: "The Pulse <pulse@vasteams.com>",
        to: user.email,
        subject: "Your weekly AI pulse check-in is ready",
        html: `
          <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px; background: #000; color: #d4d4d8;">
            <h1 style="font-size: 18px; color: #fff; margin-bottom: 8px;">The Pulse</h1>
            <p style="font-size: 13px; color: #71717a; margin-bottom: 24px;">Weekly check-in</p>
            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px;">
              How did AI shape your thinking, work, and growth this week? Your 45-second pulse check is ready.
            </p>
            <a href="${linkData.properties.action_link}"
               style="display: inline-block; padding: 12px 24px; border: 1px solid rgba(16,185,129,0.4); background: rgba(16,185,129,0.1); color: #10b981; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
              Start check-in &rarr;
            </a>
            <p style="font-size: 11px; color: #3f3f46; margin-top: 32px;">
              This link expires in 24 hours. Sent from vasteams.com/pulse
            </p>
          </div>
        `,
      });

      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: eligibleUsers.length,
  });
}
