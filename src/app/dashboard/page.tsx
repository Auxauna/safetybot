"use client";

import Link from "next/link";
import { MOCK_VISITS, getChecklistSummary } from "@/lib/mockData";
import {
  Plus,
  MapPin,
  Calendar,
  Camera,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertOctagon,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const visits = MOCK_VISITS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Safetybot</span>
          </Link>
          <Link
            href="/visit/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Inspections</h1>
          <p className="text-gray-500 text-sm">
            {visits.length} inspection{visits.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Visit List */}
        {visits.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function VisitCard({ visit }: { visit: (typeof MOCK_VISITS)[0] }) {
  const summary = visit.checklistResults ? getChecklistSummary(visit.checklistResults) : null;
  const isReady = visit.status === "ready" || visit.status === "reviewed";
  const isAnalyzing = visit.status === "analyzing";

  return (
    <Link
      href={`/visit/${visit.id}`}
      className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:shadow-md hover:border-gray-300 transition-all group"
    >
      {/* Compliance indicator */}
      {summary ? (
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="4"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke={
                summary.complianceRate >= 85
                  ? "#22c55e"
                  : summary.complianceRate >= 70
                  ? "#f59e0b"
                  : "#ef4444"
              }
              strokeWidth="4"
              strokeDasharray={`${(summary.complianceRate / 100) * 151} 151`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900 tabular-nums">
              {summary.complianceRate}%
            </span>
          </div>
        </div>
      ) : (
        <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900">{visit.name}</h3>
          {isAnalyzing && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing
            </span>
          )}
          {isReady && summary && summary.criticalFails > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              <AlertOctagon className="w-3 h-3" />
              {summary.criticalFails} critical
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {visit.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {visit.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(visit.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            {visit.photoCount}
          </span>
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="font-medium">{summary.pass}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span className="font-medium">{summary.warning}</span>
          </div>
        </div>
      )}

      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white border rounded-xl">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Camera className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Upload photos from a job site to create your first inspection report.
      </p>
      <Link
        href="/visit/new"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Inspection
      </Link>
    </div>
  );
}
