import { NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    return NextResponse.json(
      { error: "ADMIN_EMAILS not configured" },
      { status: 500 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const allowedEmails = adminEmails.split(",").map((e) => e.trim());
  if (!allowedEmails.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use admin client to bypass RLS and fetch all responses
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("responses")
    .select("*")
    .order("week_of", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }

  return NextResponse.json({ responses: data ?? [] });
}
