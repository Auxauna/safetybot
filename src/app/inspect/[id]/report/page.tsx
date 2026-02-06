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
} from "@/lib/mockData";
import {
  Calendar,
  User,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Download,
  Share2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DemoBanner } from "@/components/ui/DemoBanner";

export default function InspectionReportPage() {
  const params = useParams();
  const inspectionId = params.id as string;
  const [showExportMenu, setShowExportMenu] = useState(false);

  const inspection = getInspectionWithSite(inspectionId);
  const photos = getPhotosForInspection(inspectionId);
  const stats = getPhotoStats(inspectionId);

  if (!inspection) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Inspection not found</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
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
  const findingsByCategory: Record<string, Array<{ finding: any; photo: any }>> = {};
  for (const item of confirmedFindings) {
    const cat = item.finding.category;
    if (!findingsByCategory[cat]) {
      findingsByCategory[cat] = [];
    }
    findingsByCategory[cat].push(item);
  }

  const totalPhotos = photos.length;
  const compliancePercent = totalPhotos > 0
    ? Math.round((stats.compliant / totalPhotos) * 100)
    : 0;

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
              Safety Inspection Report
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
            <strong>Demo Report:</strong> This is a sample AI-generated safety inspection report.
            In production, findings would be populated from actual photo analysis.
          </DemoBanner>
        </div>

        {/* Report content - printable area */}
        <div className="space-y-8 print:space-y-6">
          {/* Report header */}
          <div className="bg-white rounded-xl border p-6 print:border-gray-300">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
                  <Shield className="w-4 h-4" />
                  AI-POWERED SAFETY ANALYSIS
                </div>
                <h2 className="text-xl font-bold text-gray-900">{inspection.siteName}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {inspection.completedAt
                      ? formatDateTime(inspection.completedAt)
                      : formatDateTime(inspection.startedAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-gray-400" />
                    {totalPhotos} photos analyzed
                  </div>
                  {inspection.inspectorName && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      {inspection.inspectorName}
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance score */}
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

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Photos Analyzed"
              value={totalPhotos}
              icon={Camera}
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

          {/* Critical findings alert */}
          {criticalFindings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    {criticalFindings.length} Critical Issue
                    {criticalFindings.length !== 1 ? "s" : ""} Requiring Immediate Action
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    These items represent serious safety violations that may require stop-work orders.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {criticalFindings.slice(0, 5).map(({ finding, photo }, idx) => (
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
                <h3 className="font-semibold text-gray-900">Findings by Category</h3>
              </div>
              <div className="divide-y">
                {Object.entries(findingsByCategory)
                  .sort((a, b) => {
                    const aCritical = a[1].filter((f) => f.finding.severity === "critical").length;
                    const bCritical = b[1].filter((f) => f.finding.severity === "critical").length;
                    return bCritical - aCritical;
                  })
                  .map(([category, items]) => {
                    const critical = items.filter((f) => f.finding.severity === "critical").length;
                    const warning = items.filter((f) => f.finding.severity === "warning").length;
                    const compliant = items.filter((f) => f.finding.severity === "compliant").length;
                    const categoryLabel = items[0]?.finding.categoryLabel || category;

                    return (
                      <div key={category} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
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
                        </div>

                        {/* Show non-compliant items */}
                        {items.filter((f) => f.finding.severity !== "compliant").length > 0 && (
                          <div className="mt-3 space-y-3">
                            {items
                              .filter((f) => f.finding.severity !== "compliant")
                              .map(({ finding, photo }) => (
                                <div
                                  key={`${photo._id}-${finding.id}`}
                                  className={cn(
                                    "p-3 rounded-lg flex gap-4",
                                    finding.severity === "critical"
                                      ? "bg-red-50"
                                      : "bg-amber-50"
                                  )}
                                >
                                  {/* Photo thumbnail */}
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
                                        <strong>Action:</strong> {finding.recommendation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Positive Observations */}
          {positiveFindings.length > 0 && (
            <div className="bg-white rounded-xl border print:border-gray-300">
              <div className="px-6 py-4 border-b bg-green-50">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Positive Observations ({positiveFindings.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {positiveFindings.map(({ finding, photo }) => (
                    <div
                      key={`${photo._id}-${finding.id}`}
                      className="bg-green-50 rounded-lg p-3"
                    >
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-green-800">
                        {finding.title}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {finding.categoryLabel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes section */}
          {inspection.notes && (
            <div className="bg-white rounded-xl border p-6 print:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-3">
                Inspector Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {inspection.notes}
              </p>
            </div>
          )}

          {/* Photo Evidence Gallery */}
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
                        photo.overallSeverity === "critical" && "ring-2 ring-red-500",
                        photo.overallSeverity === "warning" && "ring-2 ring-amber-500"
                      )}
                    >
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                      />
                      {/* Severity indicator */}
                      <div
                        className={cn(
                          "absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center",
                          photo.overallSeverity === "critical" && "bg-red-500",
                          photo.overallSeverity === "warning" && "bg-amber-500",
                          photo.overallSeverity === "compliant" && "bg-green-500",
                          (!photo.overallSeverity || photo.overallSeverity === "unclear") &&
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

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t print:border-gray-300">
            <p>
              Report generated by Safetybot AI Safety Analysis •{" "}
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
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", style.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={cn("text-2xl font-bold tabular-nums", style.text)}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
