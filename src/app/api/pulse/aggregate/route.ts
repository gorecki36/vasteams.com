import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const currentEmail = request.nextUrl.searchParams.get("email")?.trim()?.toLowerCase();
  const admin = createAdminSupabaseClient();

  const { data, error } = await admin
    .from("responses")
    .select("user_id, week_of, q1_substitution, q2_expansion, q3_meaning, q4_efficacy, q5_role_breadth, q6_addiction, q7_progress")
    .order("week_of", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Averages per week
  const weekMap = new Map<string, { sums: number[]; count: number }>();
  for (const row of data ?? []) {
    const entry = weekMap.get(row.week_of) ?? { sums: [0, 0, 0, 0, 0, 0, 0], count: 0 };
    entry.sums[0] += row.q1_substitution;
    entry.sums[1] += row.q2_expansion;
    entry.sums[2] += row.q3_meaning;
    entry.sums[3] += row.q4_efficacy;
    entry.sums[4] += row.q5_role_breadth;
    entry.sums[5] += row.q6_addiction;
    entry.sums[6] += row.q7_progress;
    entry.count++;
    weekMap.set(row.week_of, entry);
  }

  const aggregates = Array.from(weekMap.entries()).map(([week_of, { sums, count }]) => ({
    week_of, count,
    avg_q1: sums[0] / count, avg_q2: sums[1] / count, avg_q3: sums[2] / count,
    avg_q4: sums[3] / count, avg_q5: sums[4] / count, avg_q6: sums[5] / count,
    avg_q7: sums[6] / count,
  }));

  // Individual dots — latest per user, anonymized
  const userLatest = new Map<string, (typeof data)[0]>();
  for (const row of data ?? []) {
    const existing = userLatest.get(row.user_id);
    if (!existing || row.week_of > existing.week_of) {
      userLatest.set(row.user_id, row);
    }
  }

  const individuals = Array.from(userLatest.values()).map((row) => ({
    q1: row.q1_substitution, q2: row.q2_expansion, q3: row.q3_meaning,
    q4: row.q4_efficacy, q5: row.q5_role_breadth, q6: row.q6_addiction,
    q7: row.q7_progress,
    isCurrentUser: row.user_id === currentEmail,
  }));

  return NextResponse.json(
    { aggregates, individuals },
    { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
