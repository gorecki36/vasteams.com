import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Wrap EVERYTHING in try/catch — if anything fails, let the request through
  try {
    // Skip auth if Supabase is not configured (demo/dev mode)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            supabaseResponse = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet) {
              supabaseResponse.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    // Refresh session with a 5s timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000)
    );
    await Promise.race([supabase.auth.getUser(), timeoutPromise]);

    return supabaseResponse;
  } catch {
    // Any failure at all — Supabase down, timeout, SDK error — fail open
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/pulse/:path*", "/api/pulse/:path*", "/auth/:path*"],
};
