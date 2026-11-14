"use client";

import { useEffect } from "react";

export function PageViewTracker({ username }: { username: string }) {
  useEffect(() => {
    // Fire and forget page view increment
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch((err) => console.error("View track error:", err));
  }, [username]);

  return null;
}
