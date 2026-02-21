"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ComplianceDonut } from "@/components/ui/ComplianceDonut";
import { formatDateTime } from "@/lib/dateUtils";
import {
  getInspectionWithSite,
  getPhotosForInspection,
  getPhotoStats,
  getBlitzForInspection,
  DEMO_CORRECTIVE_ACTIONS,
  DEMO_SITE_FINDINGS,
} from "@/lib/mockData";
import { getCategoryLabel } from "@/lib/categories";
import {
  Calendar,
  User,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  AlertCircle,
  Camera,
  Shield,
  Download,
  Share2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Award,
  TrendingUp,
  ClipboardCheck,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DemoBanner } from "@/components/ui/DemoBanner";

export default function InspectionReportPage() {
  const params = useParams();
  const inspectionId = params.id as string;
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const inspection = getInspectionWithSite(inspectionId);
  const photos = getPhotosForInspection(inspectionId);
  const stats = getPhotoStats(inspectionId);
  const blitz = getBlitzForInspection(inspectionId);

  if (!inspection) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Inspection not found</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Go back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  // Get all confirmed findings from photos
  const confirmedFindings: Array<{ finding: any; photo: any }> = [];
  const criticalFindings: Array<{ finding: any; photo: any }> = [];
  const warningFindings: Array<{ finding: any; photo: any }> = [];
  const positiveFindings: Array<{ finding: any; photo: any }> = [];

  for (const photo of photos) {
    if (photo.aiFindings) {
      for (const finding of photo.aiFindings) {
        if (finding.status === "confirmed" || finding.status === "pending") {
          confirmedFindings.push({ finding, photo });
          if (finding.severity === "critical") {
            criticalFindings.push({ finding, photo });
          } else if (finding.severity === "warning") {
            warningFindings.push({ finding, photo });
          } else if (finding.severity === "compliant") {
            positiveFindings.push({ finding, photo });
          }
        }
      }
    }
  }

  // Group findings by category
  const findingsByCategory: Record<
    string,
    Array<{ finding: any; photo: any }>
  > = {};
  for (const item of confirmedFindings) {
    const cat = item.finding.category;
    if (!findingsByCategory[cat]) {
      findingsByCategory[cat] = [];
    }
    findingsByCategory[cat].push(item);
  }

  const totalPhotos = photos.length;
  const overallScore = blitz?.overallScore ?? (totalPhotos > 0
    ? Math.round((stats.compliant / totalPhotos) * 100)
    : 0);

  // Get corrective actions for this inspection
  const siteFindings = DEMO_SITE_FINDINGS.filter(
    (f) => f.inspectionId === inspectionId
  );
  const correctiveActions = DEMO_CORRECTIVE_ACTIONS.filter((a) =>
    siteFindings.some((f) => f._id === a.findingId)
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const scoreColor =
    overallScore >= 80
      ? "text-green-600"
      : overallScore >= 60
        ? "text-amber-600"
        : "text-red-600";

  const scoreBgColor =
    overallScore >= 80
      ? "bg-green-50 border-green-200"
      : overallScore >= 60
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  const scoreLabel =
    overallScore >= 80
      ? "On Track"
      : overallScore >= 60
        ? "Needs Improvement"
        : "At Risk";

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 no-print">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Safety Blitz Report
            </h1>
          </div>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border shadow-lg z-20">
                  <button
                    onClick={() => {
                      window.print();
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Report
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t"
                  >
                    <Download className="w-4 h-4" />
                    Save as PDF
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t"
                  >
                    <Share2 className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Demo banner */}
        <div className="no-print">
          <DemoBanner>
            <strong>Demo Report:</strong> This is a sample Safety Blitz report
            based on real field assessment data. In production, findings would
            be populated from actual photo analysis and field observations.
          </DemoBanner>
        </div>

        {/* Report content - printable area */}
        <div className="space-y-8 print:space-y-6">
          {/* ========== 1. REPORT HEADER ========== */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 text-white print:bg-white print:text-gray-900 print:border print:border-gray-300">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-300 print:text-blue-600 font-medium mb-2">
                  <Shield className="w-4 h-4" />
                  SAFETY BLITZ REPORT
                </div>
                <h2 className="text-2xl font-bold">
                  {inspection.siteName}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300 print:text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {blitz?.date
                      ? new Date(blitz.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : inspection.completedAt
                        ? formatDateTime(inspection.completedAt)
                        : formatDateTime(inspection.startedAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    {blitz
                      ? `${blitz.fppesCompleted} FPPe completed`
                      : `${totalPhotos} photos analyzed`}
                  </div>
                  {inspection.inspectorName && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {inspection.inspectorName}
                    </div>
                  )}
                </div>
              </div>

              {/* FPPe Score */}
              <div className="flex items-center gap-4">
                <ComplianceDonut
                  total={totalPhotos}
                  compliant={stats.compliant}
                  warnings={stats.warning}
                  critical={stats.critical}
                  size={100}
                />
              </div>
            </div>
          </div>

          {/* ========== 2. RULES OF THE GAME ========== */}
          <div className="bg-white rounded-xl border p-6 print:border-gray-300">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Rules of the Game</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                This is a snapshot assessment, not a comprehensive review
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Goal is to provide an independent assessment to help ensure
                FPPe accuracy and reduce risk
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>
                  This is <strong>NOT about the who</strong> — it&apos;s about the
                  why
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Goal is to find actions to improve results in support of our
                safety mission
              </li>
            </ul>
          </div>

          {/* ========== 3. SCOPE & STATS ========== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label={blitz ? "FPPe Completed" : "Photos Analyzed"}
              value={blitz ? blitz.fppesCompleted : totalPhotos}
              icon={ClipboardCheck}
              color="blue"
            />
            <SummaryCard
              label="Critical Issues"
              value={stats.critical}
              icon={AlertCircle}
              color="red"
            />
            <SummaryCard
              label="Warnings"
              value={stats.warning}
              icon={AlertTriangle}
              color="amber"
            />
            <SummaryCard
              label="Compliant"
              value={stats.compliant}
              icon={CheckCircle2}
              color="green"
            />
          </div>

          {/* ========== 4. TEAM MEMBERS ========== */}
          {blitz && blitz.teamMembers.length > 0 && (
            <div className="bg-white rounded-xl border p-6 print:border-gray-300">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Safety Blitz Team
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {blitz.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== 5. FPPe RATING ========== */}
          <div
            className={cn(
              "rounded-xl border p-6 print:border-gray-300",
              scoreBgColor
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                FPPe Rating — Overall Branch Score
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className={cn("text-5xl font-bold tabular-nums", scoreColor)}>
                  {overallScore}%
                </p>
                <p
                  className={cn(
                    "text-sm font-medium mt-1",
                    overallScore >= 80
                      ? "text-green-700"
                      : overallScore >= 60
                        ? "text-amber-700"
                        : "text-red-700"
                  )}
                >
                  {scoreLabel}
                </p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={cn(
                      "h-4 rounded-full transition-all duration-700",
                      overallScore >= 80
                        ? "bg-green-500"
                        : overallScore >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span className="text-amber-600 font-medium">60%</span>
                  <span className="text-green-600 font-medium">80%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 6. SCORECARD ========== */}
          {blitz && (
            <div className="bg-white rounded-xl border p-6 print:border-gray-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Safety Scorecard — {blitz.scorecard.fiscalYear}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "px-6 py-4 rounded-xl text-center",
                    blitz.scorecard.recordables === 0
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  )}
                >
                  <p
                    className={cn(
                      "text-3xl font-bold",
                      blitz.scorecard.recordables === 0
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {blitz.scorecard.recordables}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Recordable Incidents
                  </p>
                </div>
                {blitz.scorecard.recordables === 0 && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      Zero recordables — keep it up!
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== 7. FIELD FINDINGS BY CATEGORY ========== */}
          {/* Critical findings alert */}
          {criticalFindings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    {criticalFindings.length} Critical Issue
                    {criticalFindings.length !== 1 ? "s" : ""} — At Risk
                    Findings
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    These items represent serious FPP deviations requiring
                    immediate corrective action.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {criticalFindings.slice(0, 5).map(({ finding, photo }) => (
                      <li
                        key={`${photo._id}-${finding.id}`}
                        className="text-sm text-red-800 flex items-start gap-2"
                      >
                        <span className="font-mono text-xs bg-red-100 px-1.5 py-0.5 rounded">
                          {finding.categoryLabel}
                        </span>
                        <span>{finding.title}</span>
                      </li>
                    ))}
                    {criticalFindings.length > 5 && (
                      <li className="text-sm text-red-700 font-medium">
                        +{criticalFindings.length - 5} more critical issues
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Findings by Category */}
          {Object.keys(findingsByCategory).length > 0 && (
            <div className="bg-white rounded-xl border print:border-gray-300">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  Field Findings by Category
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  FPPe at-risk findings and positive observations
                </p>
              </div>
              <div className="divide-y">
                {Object.entries(findingsByCategory)
                  .sort((a, b) => {
                    const aCritical = a[1].filter(
                      (f) => f.finding.severity === "critical"
                    ).length;
                    const bCritical = b[1].filter(
                      (f) => f.finding.severity === "critical"
                    ).length;
                    return bCritical - aCritical;
                  })
                  .map(([category, items]) => {
                    const critical = items.filter(
                      (f) => f.finding.severity === "critical"
                    ).length;
                    const warning = items.filter(
                      (f) => f.finding.severity === "warning"
                    ).length;
                    const compliant = items.filter(
                      (f) => f.finding.severity === "compliant"
                    ).length;
                    const categoryLabel =
                      items[0]?.finding.categoryLabel || getCategoryLabel(category);
                    const isExpanded = expandedCategories.has(category);
                    const nonCompliantItems = items.filter(
                      (f) => f.finding.severity !== "compliant"
                    );
                    const compliantItems = items.filter(
                      (f) => f.finding.severity === "compliant"
                    );

                    return (
                      <div key={category}>
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 text-gray-400 transition-transform",
                                isExpanded && "rotate-90"
                              )}
                            />
                            <span className="font-medium text-gray-900">
                              {categoryLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {critical > 0 && (
                              <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {critical}
                              </span>
                            )}
                            {warning > 0 && (
                              <span className="text-sm font-medium text-amber-600 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {warning}
                              </span>
                            )}
                            {compliant > 0 && (
                              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {compliant}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="px-6 pb-4">
                            {/* Non-compliant findings */}
                            {nonCompliantItems.length > 0 && (
                              <div className="space-y-3">
                                {nonCompliantItems.map(({ finding, photo }) => (
                                  <div
                                    key={`${photo._id}-${finding.id}`}
                                    className={cn(
                                      "p-3 rounded-lg flex gap-4",
                                      finding.severity === "critical"
                                        ? "bg-red-50"
                                        : "bg-amber-50"
                                    )}
                                  >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      <img
                                        src={photo.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={cn(
                                            "text-xs font-medium px-1.5 py-0.5 rounded",
                                            finding.severity === "critical"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-amber-100 text-amber-700"
                                          )}
                                        >
                                          {finding.severity.toUpperCase()}
                                        </span>
                                        {finding.regulation && (
                                          <span className="text-xs text-gray-500">
                                            {finding.regulation}
                                          </span>
                                        )}
                                      </div>
                                      <p className="font-medium text-gray-900 mt-1 text-sm">
                                        {finding.title}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {finding.description}
                                      </p>
                                      {finding.recommendation && (
                                        <p className="text-sm text-blue-700 mt-2">
                                          <strong>Action:</strong>{" "}
                                          {finding.recommendation}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Compliant findings within category */}
                            {compliantItems.length > 0 && (
                              <div
                                className={cn(
                                  "space-y-2",
                                  nonCompliantItems.length > 0 && "mt-3"
                                )}
                              >
                                {compliantItems.map(({ finding, photo }) => (
                                  <div
                                    key={`${photo._id}-${finding.id}`}
                                    className="p-3 rounded-lg flex gap-4 bg-green-50"
                                  >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      <img
                                        src={photo.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                                        POSITIVE
                                      </span>
                                      <p className="font-medium text-green-800 mt-1 text-sm">
                                        {finding.title}
                                      </p>
                                      <p className="text-sm text-green-700 mt-1">
                                        {finding.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Always show findings in print mode */}
                        <div className="hidden print:block px-6 pb-4">
                          {nonCompliantItems.length > 0 && (
                            <div className="space-y-3">
                              {nonCompliantItems.map(({ finding, photo }) => (
                                <div
                                  key={`print-${photo._id}-${finding.id}`}
                                  className={cn(
                                    "p-3 rounded-lg",
                                    finding.severity === "critical"
                                      ? "bg-red-50"
                                      : "bg-amber-50"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "text-xs font-medium px-1.5 py-0.5 rounded",
                                        finding.severity === "critical"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-amber-100 text-amber-700"
                                      )}
                                    >
                                      {finding.severity.toUpperCase()}
                                    </span>
                                    <span className="font-medium text-gray-900 text-sm">
                                      {finding.title}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {finding.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========== 8. SIF PREVENTION FRAMEWORK ========== */}
          <div className="bg-white rounded-xl border p-6 print:border-gray-300">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                SIF Prevention Framework
              </h3>
              <span className="text-xs text-gray-500">
                Serious Injury &amp; Fatality Prevention
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="font-semibold text-blue-900">Rules</p>
                <p className="text-xs text-blue-700 mt-1">
                  FPP pocket guide on person. Zero tolerance enforcement.
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-2">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <p className="font-semibold text-green-900">Tools</p>
                <p className="text-xs text-green-700 mt-1">
                  Key FPP/PPE &amp; tools. App &amp; analytics.
                </p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <p className="font-semibold text-amber-900">Educate</p>
                <p className="text-xs text-amber-700 mt-1">
                  Stations 2.0 training. Class &amp; hands-on instruction.
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6" />
                </div>
                <p className="font-semibold text-purple-900">Evaluate</p>
                <p className="text-xs text-purple-700 mt-1">
                  Field evaluation. FPPe % SIF prevention rating.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Coaching, Enforcement, Recognition + App &amp; Analytics
            </p>
          </div>

          {/* ========== 9. ROAD TO ZERO ========== */}
          {correctiveActions.length > 0 && (
            <div className="bg-white rounded-xl border print:border-gray-300">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  Road to Zero — Corrective Actions
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Action items to achieve zero recordable incidents
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Finding
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Owner
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {correctiveActions.map((action) => {
                      const finding = siteFindings.find(
                        (f) => f._id === action.findingId
                      );
                      return (
                        <tr key={action._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                              {finding
                                ? getCategoryLabel(finding.category)
                                : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-900 max-w-xs">
                            {finding?.title || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-700 max-w-sm">
                            {action.description}
                          </td>
                          <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                            {action.assignedTo}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded",
                                action.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : action.status === "in_progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              )}
                            >
                              {action.status === "in_progress"
                                ? "In Progress"
                                : action.status === "completed"
                                  ? "Complete"
                                  : "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== 10. SAFETY CHAMPIONS ========== */}
          {blitz && blitz.champions.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6 print:border-gray-300">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">
                  Safety Blitz Champions
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {blitz.champions.map((champion, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-amber-200 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      {champion
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{champion}</p>
                      <p className="text-xs text-amber-600">
                        Safety Champion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== 11. CLOSING MESSAGE ========== */}
          <div className="bg-gray-900 text-white rounded-xl p-6 text-center print:bg-gray-100 print:text-gray-900">
            <Heart className="w-6 h-6 mx-auto mb-3 text-red-400 print:text-red-600" />
            <p className="text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              We care for life when we take care of our people. We elevate our
              work when we elevate safety. Our customers, our team, and our
              families are depending on us. We stay focused. We look out for
              each other.
            </p>
          </div>

          {/* ========== 12. PHOTO EVIDENCE GALLERY ========== */}
          {photos.length > 0 && (
            <div className="bg-white rounded-xl border print:border-gray-300">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  Photo Evidence ({photos.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {photos.slice(0, 20).map((photo) => (
                    <div
                      key={photo._id}
                      className={cn(
                        "aspect-square rounded-lg overflow-hidden bg-gray-100 relative",
                        photo.overallSeverity === "critical" &&
                          "ring-2 ring-red-500",
                        photo.overallSeverity === "warning" &&
                          "ring-2 ring-amber-500"
                      )}
                    >
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={cn(
                          "absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center",
                          photo.overallSeverity === "critical" && "bg-red-500",
                          photo.overallSeverity === "warning" && "bg-amber-500",
                          photo.overallSeverity === "compliant" &&
                            "bg-green-500",
                          (!photo.overallSeverity ||
                            photo.overallSeverity === "unclear") &&
                            "bg-gray-400"
                        )}
                      >
                        {photo.overallSeverity === "critical" && (
                          <AlertCircle className="w-3 h-3 text-white" />
                        )}
                        {photo.overallSeverity === "warning" && (
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                        )}
                        {photo.overallSeverity === "compliant" && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {photos.length > 20 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    +{photos.length - 20} more photos
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========== 13. FOOTER ========== */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t print:border-gray-300">
            <p>
              Safety Blitz Report generated by Safetybot AI Safety Analysis
              &bull;{" "}
              {inspection.completedAt
                ? formatDateTime(inspection.completedAt)
                : formatDateTime(Date.now())}
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          nav,
          header,
          footer,
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          main {
            padding: 0 !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 1.5rem !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          .print\\:text-blue-600 {
            color: #2563eb !important;
          }
          .print\\:bg-gray-100 {
            background: #f3f4f6 !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "green" | "red" | "amber" | "gray" | "blue";
}) {
  const colors = {
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      text: "text-green-700",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      text: "text-red-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
    },
    gray: {
      bg: "bg-gray-50",
      icon: "bg-gray-100 text-gray-600",
      text: "text-gray-700",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      text: "text-blue-700",
    },
  };

  const style = colors[color];

  return (
    <div className={cn("rounded-xl border p-4", style.bg)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            style.icon
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={cn("text-2xl font-bold tabular-nums", style.text)}>
            {value}
          </p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
