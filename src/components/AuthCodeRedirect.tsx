"use client";

import { useEffect } from "react";

export default function AuthCodeRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && !window.location.pathname.startsWith("/pulse")) {
      // Redirect code to /pulse where auth is handled
      window.location.href = `/pulse?code=${code}`;
    }
  }, []);

  return null;
}
