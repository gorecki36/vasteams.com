import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim()?.toLowerCase();
  if (!email) return NextResponse.json({ reminder_day: 1 });

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from("user_preferences")
    .select("reminder_day")
    .eq("email", email)
    .single();

  return NextResponse.json({ reminder_day: data?.reminder_day ?? 1 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email?.trim()?.toLowerCase();
  const reminderDay = body.reminder_day;

  if (!email || reminderDay === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("user_preferences")
    .upsert({ email, reminder_day: reminderDay }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
