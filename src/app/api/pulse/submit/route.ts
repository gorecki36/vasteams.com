import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

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
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const weekOf = body.week_of;
  if (!weekOf || !/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) {
    return NextResponse.json(
      { error: "Invalid week_of format" },
      { status: 400 }
    );
  }

  for (const col of QUESTION_COLUMNS) {
    const val = body[col];
    if (!Number.isInteger(val) || val < 1 || val > 7) {
      return NextResponse.json(
        { error: `Invalid value for ${col}: must be integer 1-7` },
        { status: 400 }
      );
    }
  }

  const row = {
    user_id: user.id,
    week_of: weekOf,
    type: body.type ?? "weekly",
    ...Object.fromEntries(QUESTION_COLUMNS.map((col) => [col, body[col]])),
  };

  const { error } = await supabase.from("responses").insert(row);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Already submitted for this week" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
