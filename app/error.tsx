"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div 
          className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        >
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--fg)" }}>
          Etwas ist schiefgelaufen
        </h1>
        
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es erneut 
          oder kontaktiere uns, wenn das Problem weiterhin besteht.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            Erneut versuchen
          </button>
          
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "transparent",
              color: "var(--fg)",
              border: "2px solid var(--border)",
            }}
          >
            Zur Startseite
          </a>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-8 text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Fehler-ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
