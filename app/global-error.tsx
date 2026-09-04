"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: "2rem", backgroundColor: "#f6f5f8", color: "#1b0b2e" }}>
        <div style={{ maxWidth: 480, margin: "10vh auto", textAlign: "center", background: "#ffffff", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b6480", marginBottom: "1.5rem" }}>An unexpected error occurred. Please try reloading the page.</p>
          <button
            onClick={() => reset()}
            style={{ backgroundColor: "#4a1e9e", color: "#ffffff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
