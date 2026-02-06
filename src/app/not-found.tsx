import { AppShell } from "@/components/layout/AppShell";
import { NotFoundDisplay } from "@/components/ui/ErrorDisplay";

export default function NotFound() {
  return (
    <AppShell>
      <NotFoundDisplay
        title="Page not found"
        message="The page you're looking for doesn't exist or has been moved."
      />
    </AppShell>
  );
}
