"use client";

import { useEffect } from "react";
import { initClientGeo } from "@/lib/client-geo";

export function PageViewTracker({ username }: { username: string }) {
  useEffect(() => {
    // Pre-warm client geolocation for accurate city tracking
    initClientGeo();

    // Fire and forget page view increment
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch((err) => console.error("View track error:", err));
  }, [username]);

  return null;
}
