import { AppShell } from "@/components/layout/AppShell";

export default function FindingLoading() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-20 bg-red-100 rounded-full" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="h-8 w-96 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6">
          {/* Description card */}
          <div className="bg-white rounded-xl border p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-5/6 bg-gray-100 rounded" />
              <div className="h-4 w-4/6 bg-gray-100 rounded" />
            </div>
          </div>

          {/* Corrective actions card */}
          <div className="bg-white rounded-xl border p-6 animate-pulse">
            <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                  </div>
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
