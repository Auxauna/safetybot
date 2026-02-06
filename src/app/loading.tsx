import { AppShell } from "@/components/layout/AppShell";
import { LoadingPage } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <AppShell>
      <LoadingPage message="Loading..." />
    </AppShell>
  );
}
