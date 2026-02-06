"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <ErrorDisplay
        title="Something went wrong"
        message="We encountered an unexpected error. Please try again or return to the dashboard."
        error={error}
        reset={reset}
        showHomeLink
      />
    </AppShell>
  );
}
