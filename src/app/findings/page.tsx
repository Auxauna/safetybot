"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { getSiteFindings, getSites, SiteFinding } from "@/lib/mockData";
import { formatDistanceToNow, formatDate } from "@/lib/dateUtils";
import { getCategoryLabel } from "@/lib/categories";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Filter,
  Search,
  Building2,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "open" | "assigned" | "resolved";
type SeverityFilter = "all" | "critical" | "warning";

export default function FindingsPage() {
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get("status") as StatusFilter) || "all"
  );
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>(
    (searchParams.get("severity") as SeverityFilter) || "all"
  );
  const [siteFilter, setSiteFilter] = useState<string>(
    searchParams.get("site") || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Update filters when URL params change
  useEffect(() => {
    const status = searchParams.get("status") as StatusFilter;
    const severity = searchParams.get("severity") as SeverityFilter;
    const site = searchParams.get("site");

    if (status && ["all", "open", "assigned", "resolved"].includes(status)) {
      setStatusFilter(status);
    }
    if (severity && ["all", "critical", "warning"].includes(severity)) {
      setSeverityFilter(severity);
    }
    if (site) {
      setSiteFilter(site);
    }
  }, [searchParams]);

  const findings = getSiteFindings();
  const sites = getSites();

  const siteMap = new Map(sites.map((s) => [s._id, s]));

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    // Status filter
    if (statusFilter !== "all" && f.status !== statusFilter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== "all" && f.severity !== severityFilter) {
      return false;
    }

    // Site filter
    if (siteFilter !== "all" && f.siteId !== siteFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = f.title.toLowerCase().includes(query);
      const matchesDesc = f.description.toLowerCase().includes(query);
      const matchesSite = siteMap.get(f.siteId)?.name.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesSite) return false;
    }

    return true;
  });

  // Count by status for tabs
  const statusCounts = {
    all: findings.length,
    open: findings.filter((f) => f.status === "open").length,
    assigned: findings.filter((f) => f.status === "assigned").length,
    resolved: findings.filter((f) => f.status === "resolved").length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FPPe Findings</h1>
          <p className="text-gray-500 mt-1">
            Track and manage safety findings across all branches
          </p>
        </div>

        {/* Search and filter toggle */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter toggle button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "sm:hidden flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors relative",
              showFilters || severityFilter !== "all" || siteFilter !== "all"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white text-gray-700"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(severityFilter !== "all" || siteFilter !== "all") && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {(severityFilter !== "all" ? 1 : 0) + (siteFilter !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Desktop filters */}
          <div className="hidden sm:flex gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
              className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
            </select>

            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sites</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filters dropdown */}
        {showFilters && (
          <div className="sm:hidden flex gap-3 p-4 bg-gray-50 rounded-lg border">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
              className="flex-1 px-3 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
            </select>

            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="all">All Sites</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status tabs */}
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg min-w-max sm:min-w-0">
            {(
              [
                { key: "all", label: "All" },
                { key: "open", label: "Open" },
                { key: "assigned", label: "Assigned" },
                { key: "resolved", label: "Resolved" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  statusFilter === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {label}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                    statusFilter === key
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-200/70 text-gray-500"
                  )}
                >
                  {statusCounts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Findings list */}
        {filteredFindings.length === 0 ? (
          <FindingsEmpty hasFilters={statusFilter !== "all" || severityFilter !== "all" || siteFilter !== "all" || !!searchQuery} />
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {filteredFindings.map((finding) => (
              <FindingRow
                key={finding._id}
                finding={finding}
                siteName={siteMap.get(finding.siteId)?.name}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FindingRow({
  finding,
  siteName,
}: {
  finding: SiteFinding;
  siteName?: string;
}) {
  const severityIcons = {
    critical: AlertCircle,
    warning: AlertTriangle,
  };
  const Icon = severityIcons[finding.severity];

  const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    open: { label: "Open", bg: "bg-red-100", text: "text-red-700" },
    assigned: { label: "Assigned", bg: "bg-blue-100", text: "text-blue-700" },
    resolved: { label: "Resolved", bg: "bg-green-100", text: "text-green-700" },
  };

  const status = statusConfig[finding.status] || statusConfig.open;

  return (
    <Link
      href={`/findings/${finding._id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
    >
      {/* Severity icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          finding.severity === "critical"
            ? "bg-red-100"
            : "bg-orange-100"
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5",
            finding.severity === "critical"
              ? "text-red-600"
              : "text-orange-600"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{finding.title}</p>
          <SeverityBadge severity={finding.severity} size="sm" />
        </div>
        <p className="text-sm text-gray-500 truncate mt-0.5">
          {finding.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
          {siteName && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {siteName}
            </span>
          )}
          <span>{getCategoryLabel(finding.category)}</span>
          <span>{formatDistanceToNow(finding.createdAt)}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            status.bg,
            status.text
          )}
        >
          {status.label}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

function FindingsEmpty({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="bg-white rounded-xl border p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        {hasFilters ? "No findings match your filters" : "No findings yet"}
      </h3>
      <p className="text-gray-500 mt-1">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Findings will appear here when issues are discovered during inspections"}
      </p>
    </div>
  );
}
