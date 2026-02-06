"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function FindingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <ErrorDisplay
        title="Failed to load finding"
        message="We couldn't load this finding. It may have been deleted or you may not have access."
        error={error}
        reset={reset}
        showBackLink
        showHomeLink
      />
    </AppShell>
  );
}
