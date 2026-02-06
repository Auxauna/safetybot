"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, type ChecklistCategory, type ChecklistResult } from "@/lib/checklist";
import { getPhotosByIds, getChecklistSummary, getResultsByCategory, type LegacyPhoto } from "@/lib/mockData";
import {
  Check,
  X,
  AlertTriangle,
  Circle,
  ChevronRight,
  Image as ImageIcon,
  AlertOctagon,
  Info,
} from "lucide-react";

interface ChecklistReportProps {
  results: ChecklistResult[];
  photos: LegacyPhoto[];
  onPhotoClick?: (photo: LegacyPhoto) => void;
}

export function ChecklistReport({ results, photos, onPhotoClick }: ChecklistReportProps) {
  const [expandedCategory, setExpandedCategory] = useState<ChecklistCategory | null>("machine_room");
  const summary = getChecklistSummary(results);

  const categories = Object.values(CATEGORIES);

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tabular-nums">{summary.complianceRate}%</span>
          <span className="text-sm text-gray-500">compliance</span>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">{summary.pass}</span>
            <span className="text-gray-500">pass</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium">{summary.fail}</span>
            <span className="text-gray-500">fail</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-medium">{summary.warning}</span>
            <span className="text-gray-500">warning</span>
          </span>
        </div>
        {summary.criticalFails > 0 && (
          <>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-red-600">
              <AlertOctagon className="w-4 h-4" />
              <span className="text-sm font-medium">{summary.criticalFails} critical</span>
            </div>
          </>
        )}
      </div>

      {/* Category Accordion */}
      <div className="border rounded-lg divide-y overflow-hidden">
        {categories.map((category) => {
          const categoryResults = getResultsByCategory(results, category.id);
          const categoryStats = {
            total: categoryResults.length,
            pass: categoryResults.filter((r) => r.status === "pass").length,
            fail: categoryResults.filter((r) => r.status === "fail").length,
            warning: categoryResults.filter((r) => r.status === "warning").length,
          };
          const isExpanded = expandedCategory === category.id;
          const hasFails = categoryStats.fail > 0;

          return (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors",
                  "hover:bg-gray-50",
                  isExpanded && "bg-gray-50"
                )}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-600 text-xs font-mono">
                  {category.shortLabel}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{category.label}</span>
                    {hasFails && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                        {categoryStats.fail} issue{categoryStats.fail !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{category.description}</p>
                </div>
                {/* Mini progress bar */}
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(categoryStats.pass / categoryStats.total) * 100}%` }}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${(categoryStats.warning / categoryStats.total) * 100}%` }}
                  />
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(categoryStats.fail / categoryStats.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 tabular-nums">
                  {categoryStats.pass}/{categoryStats.total}
                </span>
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>

              {/* Expanded Checklist Items */}
              {isExpanded && (
                <div className="bg-white border-t">
                  {categoryResults.map((item, idx) => (
                    <ChecklistItemRow
                      key={item.id}
                      item={item}
                      photos={getPhotosByIds(item.photoIds)}
                      onPhotoClick={onPhotoClick}
                      isLast={idx === categoryResults.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ChecklistItemRowProps {
  item: ChecklistResult;
  photos: LegacyPhoto[];
  onPhotoClick?: (photo: LegacyPhoto) => void;
  isLast: boolean;
}

function ChecklistItemRow({ item, photos, onPhotoClick, isLast }: ChecklistItemRowProps) {
  const [showDetails, setShowDetails] = useState(item.status === "fail");

  const StatusIcon = {
    pass: Check,
    fail: X,
    warning: AlertTriangle,
    not_inspected: Circle,
  }[item.status];

  const statusColors = {
    pass: "bg-green-100 text-green-600 border-green-200",
    fail: "bg-red-100 text-red-600 border-red-200",
    warning: "bg-amber-100 text-amber-600 border-amber-200",
    not_inspected: "bg-gray-100 text-gray-400 border-gray-200",
  };

  return (
    <div className={cn("px-4", !isLast && "border-b")}>
      <div
        className={cn(
          "flex items-start gap-3 py-3",
          item.status === "fail" && "bg-red-50/50 -mx-4 px-4"
        )}
      >
        {/* Status indicator */}
        <div
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full border mt-0.5",
            statusColors[item.status]
          )}
        >
          <StatusIcon className="w-3.5 h-3.5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">{item.code}</span>
                {item.criticalSafety && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                    CRITICAL
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-900 mt-0.5">{item.requirement}</p>
              {item.regulation && (
                <p className="text-xs text-gray-400 mt-0.5">{item.regulation}</p>
              )}
            </div>

            {/* Photo evidence thumbnails */}
            {photos.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {photos.slice(0, 3).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => onPhotoClick?.(photo)}
                    className="w-10 h-10 rounded overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {photos.length > 3 && (
                  <span className="text-xs text-gray-400 ml-1">+{photos.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Notes/AI observation */}
          {item.notes && (
            <div
              className={cn(
                "mt-2 flex items-start gap-2 text-sm",
                item.status === "fail" ? "text-red-700" : "text-gray-600"
              )}
            >
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />
              <span>{item.notes}</span>
            </div>
          )}

          {/* No evidence warning */}
          {photos.length === 0 && item.status !== "not_inspected" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>No photo evidence - requires manual verification</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for landing page demo
export function ChecklistReportCompact({ results }: { results: ChecklistResult[] }) {
  const summary = getChecklistSummary(results);
  const fails = results.filter((r) => r.status === "fail");
  const warnings = results.filter((r) => r.status === "warning");

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Inspection Results</span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-lg font-semibold tabular-nums",
              summary.complianceRate >= 90
                ? "text-green-600"
                : summary.complianceRate >= 70
                ? "text-amber-600"
                : "text-red-600"
            )}
          >
            {summary.complianceRate}%
          </span>
          <span className="text-xs text-gray-400">compliant</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 divide-x text-center py-3 border-b">
        <div>
          <div className="text-lg font-semibold text-gray-900">{summary.total}</div>
          <div className="text-xs text-gray-500">Items</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">{summary.pass}</div>
          <div className="text-xs text-gray-500">Pass</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-amber-600">{summary.warning}</div>
          <div className="text-xs text-gray-500">Warning</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-red-600">{summary.fail}</div>
          <div className="text-xs text-gray-500">Fail</div>
        </div>
      </div>

      {/* Issues preview */}
      <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
        {fails.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-sm">
            <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-mono text-xs text-gray-400">{item.code}</span>
              <p className="text-gray-700">{item.requirement}</p>
            </div>
          </div>
        ))}
        {warnings.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-mono text-xs text-gray-400">{item.code}</span>
              <p className="text-gray-700">{item.requirement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
