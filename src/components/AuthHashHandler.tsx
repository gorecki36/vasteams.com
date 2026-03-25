"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthHashHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createBrowserClient(url, key);

    // Handle PKCE flow: ?code= parameter
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          window.location.href = "/pulse/baseline";
        } else {
          // Code expired or invalid — go to pulse
          window.location.href = "/pulse";
        }
      });
      return;
    }

    // Handle hash fragment flow: #access_token=
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          }).then(({ error }) => {
            if (!error) {
              window.location.href = "/pulse/baseline";
            }
          });
        }
      } catch {
        // ignore
      }
      return;
    }

    // Handle error in hash
    if (hash && hash.includes("error=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return null;
}
