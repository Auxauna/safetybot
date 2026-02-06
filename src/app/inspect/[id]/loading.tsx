import { AppShell } from "@/components/layout/AppShell";
import { Loader2 } from "lucide-react";

export default function InspectionLoading() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>

        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 space-y-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="h-4 flex-1 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border p-6 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
