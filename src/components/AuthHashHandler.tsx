"use client";

import { useEffect } from "react";

export default function AuthHashHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handle PKCE flow: ?code= parameter — redirect to server-side callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      // Send to server-side route that exchanges code and sets cookies
      window.location.href = `/auth/callback?code=${code}&next=/pulse/baseline`;
      return;
    }

    // Handle hash fragment flow: #access_token=
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      // Send to server-side route with tokens in query params
      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          window.location.href = `/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}&next=/pulse/baseline`;
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
