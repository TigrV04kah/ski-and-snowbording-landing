"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "my-gudauri-cookie-consent";

function readConsentFromCookie() {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${STORAGE_KEY}=`));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

function isConsentAccepted() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || readConsentFromCookie() === "accepted";
  } catch {
    return readConsentFromCookie() === "accepted";
  }
}

export function TrackingScripts() {
  const [enabled, setEnabled] = useState(() => isConsentAccepted());

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const ymId = process.env.NEXT_PUBLIC_YM_ID;

  useEffect(() => {
    const listener = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setEnabled(custom.detail === "accepted");
    };

    window.addEventListener("cookie-consent", listener);
    return () => window.removeEventListener("cookie-consent", listener);
  }, []);

  const ymTemplate = useMemo(() => {
    if (!ymId) {
      return "";
    }

    return `
      (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${ymId}, "init", {
           clickmap:true,
           trackLinks:true,
           accurateTrackBounce:true
      });
    `;
  }, [ymId]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${gaId}');`}
          </Script>
        </>
      ) : null}
      {ymId ? (
        <>
          <Script id="ym-init" strategy="afterInteractive">
            {ymTemplate}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${ymId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}
    </>
  );
}
