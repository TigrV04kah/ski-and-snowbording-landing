"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

export function ViewTracker({
  event,
  params,
}: {
  event: string;
  params?: Record<string, string>;
}) {
  useEffect(() => {
    trackEvent(event, params);
  }, [event, params]);

  return null;
}
