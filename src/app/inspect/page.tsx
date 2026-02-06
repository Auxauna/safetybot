"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getRecentInspections, getSites } from "@/lib/mockData";
import { formatDistanceToNow, formatDate } from "@/lib/dateUtils";
import {
  Plus,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ClipboardCheck,
  Camera,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InspectionsPage() {
  const inspections = getRecentInspections(50);
  const sites = getSites();

  const siteMap = new Map(sites.map((s) => [s._id, s]));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
            <p className="text-gray-500 mt-1">
              View and manage all safety inspections
            </p>
          </div>
          <Link
            href="/inspect/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
            New Inspection
          </Link>
        </div>

        {/* Inspections list */}
        {inspections.length === 0 ? (
          <InspectionsEmpty />
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {inspections.map((inspection) => {
              const site = siteMap.get(inspection.siteId);
              return (
                <InspectionRow
                  key={inspection._id}
                  inspection={inspection}
                  siteName={site?.name || inspection.siteName || "Unknown Site"}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function InspectionRow({
  inspection,
  siteName,
}: {
  inspection: {
    _id: string;
    status: string;
    startedAt: number;
    completedAt?: number;
    summary?: {
      compliancePercent: number;
      passCount: number;
      failCount: number;
      warningCount: number;
      criticalFailures: number;
    };
  };
  siteName: string;
}) {
  const statusConfig = {
    uploading: {
      icon: Clock,
      label: "Uploading",
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    analyzing: {
      icon: Sparkles,
      label: "Analyzing",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    reviewing: {
      icon: Camera,
      label: "Needs Review",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
  };

  const status =
    statusConfig[inspection.status as keyof typeof statusConfig] ||
    statusConfig.reviewing;
  const StatusIcon = status.icon;

  const href =
    inspection.status === "completed"
      ? `/inspect/${inspection._id}/report`
      : `/inspect/${inspection._id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
    >
      {/* Status icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          status.bg
        )}
      >
        <StatusIcon className={cn("w-5 h-5", status.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <p className="font-medium text-gray-900 truncate">{siteName}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{formatDate(inspection.startedAt)}</span>
          {inspection.status === "completed" && inspection.summary && (
            <>
              <span>•</span>
              <span
                className={cn(
                  "font-medium",
                  inspection.summary.compliancePercent >= 90
                    ? "text-green-600"
                    : inspection.summary.compliancePercent >= 70
                      ? "text-amber-600"
                      : "text-red-600"
                )}
              >
                {inspection.summary.compliancePercent}% compliant
              </span>
              {inspection.summary.criticalFailures > 0 && (
                <>
                  <span>•</span>
                  <span className="text-red-600 font-medium">
                    {inspection.summary.criticalFailures} critical
                  </span>
                </>
              )}
            </>
          )}
          {inspection.status === "reviewing" && (
            <>
              <span>•</span>
              <span className="text-amber-600">Review AI findings</span>
            </>
          )}
        </div>
      </div>

      {/* Status badge & arrow */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            status.bg,
            status.color
          )}
        >
          {status.label}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

function InspectionsEmpty() {
  return (
    <div className="bg-white rounded-xl border p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <ClipboardCheck className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        No inspections yet
      </h3>
      <p className="text-gray-500 mt-1 mb-6">
        Start your first safety inspection to see it here
      </p>
      <Link
        href="/inspect/new"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Camera className="w-4 h-4" />
        New Inspection
      </Link>
    </div>
  );
}
