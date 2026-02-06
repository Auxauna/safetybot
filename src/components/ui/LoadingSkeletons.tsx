"use client";

import { cn } from "@/lib/utils";

export function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg" />
      </div>

      {/* Hero skeleton */}
      <div className="h-48 bg-gray-200 rounded-2xl" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div>
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List skeleton */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <div className="h-5 w-40 bg-gray-200 rounded" />
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded mt-1" />
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingFindings() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
      </div>

      {/* Search and filters */}
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg hidden sm:block" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg hidden sm:block" />
      </div>

      {/* Status tabs */}
      <div className="h-12 bg-gray-100 rounded-lg" />

      {/* Findings list */}
      <div className="bg-white rounded-xl border divide-y">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-5 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-100 rounded mt-1" />
              <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingInspectionReview() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-4 w-48 bg-gray-200 rounded" />
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg" />
      </div>

      {/* Demo banner */}
      <div className="h-12 bg-gray-100 rounded-lg" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <div className="h-10 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded mt-1" />
          </div>
        ))}
      </div>

      {/* Photo cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-gray-100 rounded" />
                  <div className="h-5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingReport() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-64 bg-gray-200 rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      {/* Report header card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between">
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-6 w-56 bg-gray-200 rounded mt-2" />
            <div className="flex gap-4 mt-4">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div>
                <div className="h-8 w-12 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b">
          <div className="h-5 w-40 bg-gray-200 rounded" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
