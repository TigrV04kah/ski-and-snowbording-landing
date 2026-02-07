declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  if (window.gtag) {
    window.gtag("event", event, params ?? {});
  }

  const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (window.ym && Number.isFinite(ymId) && ymId > 0) {
    window.ym(ymId, "reachGoal", event, params);
  }
}
