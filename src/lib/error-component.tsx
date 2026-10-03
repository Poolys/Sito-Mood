import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "Si è verificato un errore inatteso. Ricarica la pagina.";
const FALLBACK_MESSAGE_EN = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center " +
        "bg-bg text-fg"
      }
    >
      <span className="text-wine" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-semibold italic">
        Qualcosa è andato storto
      </h1>
      <p className="max-w-md text-sm break-words text-muted">
        {isDev ? errorMessage(error) : FALLBACK_MESSAGE}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-lg border border-accent px-6 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
      >
        Ricarica pagina
      </button>
    </main>
  );
}
