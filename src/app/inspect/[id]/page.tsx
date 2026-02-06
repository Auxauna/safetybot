"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  getInspectionWithSite,
  getPhotosForInspection,
  getPhotoStats,
  Photo,
  Finding,
} from "@/lib/mockData";
import {
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";

function SeverityBadge({
  severity,
  small = false,
}: {
  severity?: string;
  small?: boolean;
}) {
  const config = {
    critical: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: AlertCircle,
      label: "Critical",
    },
    warning: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: AlertTriangle,
      label: "Warning",
    },
    compliant: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "Compliant",
    },
    unclear: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      icon: ImageIcon,
      label: "Unclear",
    },
  };

  const cfg = config[severity as keyof typeof config] || config.unclear;
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        cfg.bg,
        cfg.text,
        small ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
      )}
    >
      <Icon className={small ? "w-3 h-3" : "w-4 h-4"} />
      {cfg.label}
    </span>
  );
}

function PhotoReviewCard({
  photo,
  isExpanded,
  onToggle,
  onReviewFinding,
  onConfirmAll,
  onRejectAll,
}: {
  photo: Photo;
  isExpanded: boolean;
  onToggle: () => void;
  onReviewFinding: (photoId: string, findingId: string, status: "confirmed" | "rejected") => void;
  onConfirmAll: (photoId: string) => void;
  onRejectAll: (photoId: string) => void;
}) {
  const findings = photo.aiFindings || [];
  const pendingFindings = findings.filter((f) => f.status === "pending");

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={photo.url}
            alt={photo.filename}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={photo.overallSeverity} />
            <span className="text-sm text-gray-500">
              {findings.length} finding{findings.length !== 1 ? "s" : ""}
            </span>
            {pendingFindings.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                {pendingFindings.length} to review
              </span>
            )}
          </div>

          {/* First finding preview */}
          {findings.length > 0 && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              <span className="font-medium">{findings[0].title}</span>
              {findings.length > 1 && (
                <span className="text-gray-400"> +{findings.length - 1} more</span>
              )}
            </p>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-2">
            {Array.from(new Set(findings.map((f) => f.categoryLabel)))
              .slice(0, 3)
              .map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  {cat}
                </span>
              ))}
          </div>
        </div>

        {/* Expand icon */}
        <div className="flex-shrink-0 text-gray-400">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t">
          {/* Full image */}
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={photo.url}
              alt={photo.filename}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Findings list */}
          <div className="p-4 space-y-3">
            {findings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No findings detected</p>
            ) : (
              <>
                {/* Bulk actions */}
                {pendingFindings.length > 1 && (
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-500">
                      {pendingFindings.length} findings need review
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onConfirmAll(photo._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        <Check className="w-4 h-4" />
                        Confirm All
                      </button>
                      <button
                        onClick={() => onRejectAll(photo._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                        Reject All
                      </button>
                    </div>
                  </div>
                )}

                {/* Individual findings */}
                {findings.map((finding) => (
                  <div
                    key={finding.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      finding.status === "confirmed" && "bg-green-50 border-green-200",
                      finding.status === "rejected" && "bg-gray-50 border-gray-200 opacity-60",
                      finding.status === "pending" && "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <SeverityBadge severity={finding.severity} small />
                          <span className="text-xs text-gray-500">
                            {finding.categoryLabel}
                          </span>
                          {finding.regulation && (
                            <span className="text-xs text-gray-400">
                              {finding.regulation}
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 mt-1">
                          {finding.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {finding.description}
                        </p>
                        {finding.recommendation && (
                          <p className="text-sm text-blue-700 mt-2 p-2 bg-blue-50 rounded">
                            <strong>Recommendation:</strong> {finding.recommendation}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      {finding.status === "pending" ? (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => onReviewFinding(photo._id, finding.id, "confirmed")}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                            title="Confirm finding"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onReviewFinding(photo._id, finding.id, "rejected")}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            title="Reject (false positive)"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          {finding.status === "confirmed" && (
                            <span className="flex items-center gap-1 text-sm text-green-700">
                              <Check className="w-4 h-4" />
                              Confirmed
                            </span>
                          )}
                          {finding.status === "rejected" && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <X className="w-4 h-4" />
                              Rejected
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InspectionPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.id as string;

  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>(() => getPhotosForInspection(inspectionId));

  const inspection = getInspectionWithSite(inspectionId);
  const stats = getPhotoStats(inspectionId);

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

  // Redirect completed inspections to report
  useEffect(() => {
    if (inspection?.status === "completed") {
      router.push(`/inspect/${inspectionId}/report`);
    }
  }, [inspection?.status, inspectionId, router]);

  if (inspection.status === "completed") {
    return null;
  }

  // Count total pending findings for progress
  const totalFindings = photos.reduce((acc, p) => acc + (p.aiFindings?.length || 0), 0);
  const reviewedFindings = photos.reduce(
    (acc, p) => acc + (p.aiFindings?.filter((f) => f.status !== "pending").length || 0),
    0
  );

  const handleReviewFinding = (
    photoId: string,
    findingId: string,
    status: "confirmed" | "rejected"
  ) => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo._id !== photoId) return photo;
        return {
          ...photo,
          aiFindings: photo.aiFindings.map((f) =>
            f.id === findingId ? { ...f, status } : f
          ),
        };
      })
    );
  };

  const handleConfirmAll = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo._id !== photoId) return photo;
        return {
          ...photo,
          reviewStatus: "confirmed",
          aiFindings: photo.aiFindings.map((f) => ({ ...f, status: "confirmed" as const })),
        };
      })
    );
  };

  const handleRejectAll = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo._id !== photoId) return photo;
        return {
          ...photo,
          reviewStatus: "rejected",
          aiFindings: photo.aiFindings.map((f) => ({ ...f, status: "rejected" as const })),
        };
      })
    );
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      router.push(`/inspect/${inspectionId}/report`);
    }, 500);
  };

  const criticalPhotos = photos.filter((p) => p.overallSeverity === "critical");
  const warningPhotos = photos.filter((p) => p.overallSeverity === "warning");
  const compliantPhotos = photos.filter((p) => p.overallSeverity === "compliant");
  const unclearPhotos = photos.filter((p) => p.overallSeverity === "unclear" || !p.overallSeverity);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Inspections", href: "/inspect" },
            { label: inspection.siteName || "Review" },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Findings</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {inspection.siteName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {stats.critical > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stats.critical}
                </span>
              )}
              {stats.warning > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stats.warning}
                </span>
              )}
              <span className="text-gray-500">
                {reviewedFindings} / {totalFindings} reviewed
              </span>
            </div>

            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo banner */}
        <DemoBanner>
          <strong>Demo Mode:</strong> Click photo cards to expand and review AI-detected findings.
          Confirm or reject each finding, then click &quot;Generate Report&quot; to see results.
        </DemoBanner>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-1">Total Photos</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50">
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-red-600 mt-1">Critical Issues</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-200 bg-amber-50">
              <div className="text-3xl font-bold text-amber-600">{stats.warning}</div>
              <div className="text-sm text-amber-600 mt-1">Warnings</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 bg-green-50">
              <div className="text-3xl font-bold text-green-600">{stats.compliant}</div>
              <div className="text-sm text-green-600 mt-1">Compliant</div>
            </div>
        </div>

        {/* Critical findings */}
        {criticalPhotos.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              Critical Issues ({criticalPhotos.length})
            </h2>
            <div className="space-y-4">
              {criticalPhotos.map((photo) => (
                <PhotoReviewCard
                  key={photo._id}
                  photo={photo}
                  isExpanded={expandedPhoto === photo._id}
                  onToggle={() =>
                    setExpandedPhoto(expandedPhoto === photo._id ? null : photo._id)
                  }
                  onReviewFinding={handleReviewFinding}
                  onConfirmAll={handleConfirmAll}
                  onRejectAll={handleRejectAll}
                />
              ))}
            </div>
          </section>
        )}

        {/* Warnings */}
        {warningPhotos.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-amber-700 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              Warnings ({warningPhotos.length})
            </h2>
            <div className="space-y-4">
              {warningPhotos.map((photo) => (
                <PhotoReviewCard
                  key={photo._id}
                  photo={photo}
                  isExpanded={expandedPhoto === photo._id}
                  onToggle={() =>
                    setExpandedPhoto(expandedPhoto === photo._id ? null : photo._id)
                  }
                  onReviewFinding={handleReviewFinding}
                  onConfirmAll={handleConfirmAll}
                  onRejectAll={handleRejectAll}
                />
              ))}
            </div>
          </section>
        )}

        {/* Compliant */}
        {compliantPhotos.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              Compliant ({compliantPhotos.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {compliantPhotos.map((photo) => (
                <div
                  key={photo._id}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group"
                >
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">No issues found</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unclear / Needs review */}
        {unclearPhotos.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5" />
              Needs Manual Review ({unclearPhotos.length})
            </h2>
            <div className="space-y-4">
              {unclearPhotos.map((photo) => (
                <PhotoReviewCard
                  key={photo._id}
                  photo={photo}
                  isExpanded={expandedPhoto === photo._id}
                  onToggle={() =>
                    setExpandedPhoto(expandedPhoto === photo._id ? null : photo._id)
                  }
                  onReviewFinding={handleReviewFinding}
                  onConfirmAll={handleConfirmAll}
                  onRejectAll={handleRejectAll}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
