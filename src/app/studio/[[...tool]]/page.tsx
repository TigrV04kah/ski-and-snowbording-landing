"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#f7f7f8",
          color: "#1f2937",
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "780px",
            width: "100%",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "28px", lineHeight: 1.2 }}>
            Sanity Studio is not configured yet
          </h1>
          <p style={{ marginTop: "12px", color: "#4b5563" }}>
            Add a real Sanity project and dataset to <code>.env.local</code>, then restart dev
            server.
          </p>
          <pre
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "10px",
              overflow: "auto",
              background: "#111827",
              color: "#e5e7eb",
            }}
          >
            {`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-01`}
          </pre>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
