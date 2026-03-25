"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthHashHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    // Handle error redirects (expired/used links)
    if (hash.includes("error=")) {
      // Clear the hash silently
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    if (!hash.includes("access_token")) return;

    try {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return;

        const supabase = createBrowserClient(url, key);
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          // Clear hash and redirect
          if (!error) {
            window.location.href = "/pulse/results";
          } else {
            window.history.replaceState(null, "", window.location.pathname);
          }
        });
      }
    } catch {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return null;
}
