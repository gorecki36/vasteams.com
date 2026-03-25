import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const QUESTION_COLUMNS = [
  "q1_substitution",
  "q2_expansion",
  "q3_meaning",
  "q4_efficacy",
  "q5_role_breadth",
  "q6_addiction",
  "q7_progress",
] as const;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email?.trim()?.toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const weekOf = body.week_of;
  if (!weekOf || !/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) {
    return NextResponse.json({ error: "Invalid week_of" }, { status: 400 });
  }

  for (const col of QUESTION_COLUMNS) {
    const val = body[col];
    if (!Number.isInteger(val) || val < 1 || val > 7) {
      return NextResponse.json({ error: `Invalid ${col}` }, { status: 400 });
    }
  }

  const admin = createAdminSupabaseClient();

  const row = {
    user_id: email,
    type: body.type ?? "weekly",
    week_of: weekOf,
    ...Object.fromEntries(QUESTION_COLUMNS.map((col) => [col, body[col]])),
  };

  const { error } = await admin.from("responses").insert(row);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
