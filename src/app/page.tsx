"use client";

import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  getDashboardStats,
  getSites,
  getRecentInspections,
  DEMO_INSPECTIONS,
} from "@/lib/mockData";
import {
  AlertTriangle,
  Clock,
  AlertCircle,
  ClipboardCheck,
  Plus,
  Building2,
  Camera,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const stats = getDashboardStats();
  const sites = getSites("active");
  const inspections = getRecentInspections(5);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safety Dashboard</h1>
            <p className="text-gray-500 mt-1">
              AI-powered construction safety inspection platform
            </p>
          </div>
          <Link
            href="/inspect/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
            New Inspection
          </Link>
        </div>

        {/* Hero Demo Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-blue-200">AI-Powered Safety Analysis</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Upload 50 photos. Get a compliance report in 10 minutes.
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl">
              Walk the job site, snap photos, and let AI do the heavy lifting. Safetybot automatically
              detects OSHA violations, categorizes findings, and generates professional reports.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/inspect/inspection_reviewing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Try the Review Workflow
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/inspect/inspection_completed/report"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                <FileText className="w-4 h-4" />
                View Sample Report
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Findings"
            value={stats.openFindings}
            icon={AlertTriangle}
            variant={stats.openFindings > 0 ? (stats.criticalFindings > 0 ? "critical" : "warning") : "default"}
          />
          <StatCard
            label="Critical Issues"
            value={stats.criticalFindings}
            icon={AlertCircle}
            variant={stats.criticalFindings > 0 ? "critical" : "default"}
            subtext={stats.criticalFindings > 0 ? "Needs immediate action" : undefined}
          />
          <StatCard
            label="Due This Week"
            value={stats.dueThisWeek}
            icon={Clock}
            variant={stats.dueThisWeek > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Overdue Actions"
            value={stats.overdueActions}
            icon={ClipboardCheck}
            variant={stats.overdueActions > 0 ? "critical" : "success"}
            subtext={stats.overdueActions === 0 ? "All on track" : "Follow up required"}
          />
        </div>

        {/* Recent Inspections */}
        <div className="bg-white rounded-xl border">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Inspections</h3>
              <p className="text-sm text-gray-500 mt-0.5">AI-analyzed safety inspections</p>
            </div>
            <Link
              href="/inspect"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {inspections.map((inspection) => (
              <Link
                key={inspection._id}
                href={`/inspect/${inspection._id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  inspection.status === "completed"
                    ? "bg-green-100"
                    : inspection.status === "reviewing"
                    ? "bg-amber-100"
                    : "bg-blue-100"
                }`}>
                  {inspection.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : inspection.status === "reviewing" ? (
                    <Camera className="w-6 h-6 text-amber-600" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {inspection.siteName}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inspection.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : inspection.status === "reviewing"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {inspection.status === "completed"
                        ? "Completed"
                        : inspection.status === "reviewing"
                        ? "Needs Review"
                        : "Analyzing"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {inspection.photoCount} photos • {inspection.inspectorName}
                  </p>
                </div>
                {inspection.summary && (
                  <div className="text-right hidden sm:block">
                    {inspection.summary.criticalFindings > 0 && (
                      <p className="text-sm font-medium text-red-600">
                        {inspection.summary.criticalFindings} critical
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {inspection.summary.compliantPhotos} compliant
                    </p>
                  </div>
                )}
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Sites List */}
        <div className="bg-white rounded-xl border">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Active Sites</h3>
              <p className="text-sm text-gray-500 mt-0.5">Construction job sites</p>
            </div>
            <Link
              href="/sites"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Manage sites
            </Link>
          </div>
          <div className="divide-y">
            {sites.map((site) => (
              <div
                key={site._id}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{site.name}</p>
                  <p className="text-sm text-gray-500 truncate">{site.address}</p>
                </div>
                <Link
                  href={`/inspect/new?siteId=${site._id}`}
                  className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="bg-gray-50 rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Walk the site</p>
                <p className="text-sm text-gray-500 mt-0.5">Take 50-100 photos during your inspection</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload photos</p>
                <p className="text-sm text-gray-500 mt-0.5">Drag and drop your batch of photos</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">AI analyzes</p>
                <p className="text-sm text-gray-500 mt-0.5">Claude Vision detects hazards automatically</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Review & export</p>
                <p className="text-sm text-gray-500 mt-0.5">Confirm findings, generate reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
