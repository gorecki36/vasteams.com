import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim()?.toLowerCase();
  const type = request.nextUrl.searchParams.get("type");
  const weekOf = request.nextUrl.searchParams.get("week_of");

  if (!email || !type || !weekOf) {
    return NextResponse.json({ exists: false });
  }

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from("responses")
    .select("id")
    .eq("user_id", email)
    .eq("type", type)
    .eq("week_of", weekOf)
    .limit(1);

  return NextResponse.json({ exists: (data ?? []).length > 0 });
}
