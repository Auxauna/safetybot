"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  DEMO_SITE_FINDINGS,
  DEMO_CORRECTIVE_ACTIONS,
  getSiteById,
  getPhotosForInspection,
  SiteFinding,
  CorrectiveAction,
} from "@/lib/mockData";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  formatDateTime,
  formatDueDate,
  isOverdue,
} from "@/lib/dateUtils";
import { getCategoryLabel } from "@/lib/categories";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  AlertCircle,
  AlertTriangle,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FindingDetailPage() {
  const params = useParams();
  const findingId = params.id as string;

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [verifyingAction, setVerifyingAction] = useState<string | null>(null);

  // Get finding from mock data
  const finding = DEMO_SITE_FINDINGS.find((f) => f._id === findingId);
  const site = finding ? getSiteById(finding.siteId) : null;
  const correctiveActions = DEMO_CORRECTIVE_ACTIONS.filter(
    (a) => a.findingId === findingId
  );

  // Get related photo evidence
  const photos = finding ? getPhotosForInspection(finding.inspectionId) : [];
  const relatedPhoto = photos.find(
    (p) =>
      p.aiFindings?.some(
        (f) => f.category === finding?.category || f.title === finding?.title
      )
  );

  if (!finding) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/findings"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Findings
          </Link>
          <div className="bg-white rounded-xl border p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Finding not found
            </h3>
            <p className="text-gray-500 mt-1">
              This finding may have been deleted or doesn&apos;t exist.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const severityConfig = {
    critical: {
      icon: AlertCircle,
      label: "Critical",
      description: "Stop work immediately",
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      text: "text-red-700",
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      description: "Correct within 24-48 hours",
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      text: "text-orange-700",
    },
  };

  const severity = severityConfig[finding.severity];
  const SeverityIcon = severity.icon;

  const statusSteps = [
    { key: "open", label: "Open" },
    { key: "assigned", label: "Assigned" },
    { key: "resolved", label: "Resolved" },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.key === finding.status
  );

  const handleStartAction = async (actionId: string) => {
    console.log("Would start action:", actionId);
  };

  const handleCompleteAction = async (actionId: string, notes?: string) => {
    console.log("Would complete action:", actionId, notes);
  };

  const handleVerifyAction = async (
    actionId: string,
    approved: boolean,
    notes?: string
  ) => {
    console.log("Would verify action:", actionId, approved, notes);
    setVerifyingAction(null);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Findings", href: "/findings" },
            { label: finding.title },
          ]}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{finding.title}</h1>
          <span
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full flex-shrink-0",
              severity.bg,
              severity.text
            )}
          >
            {severity.label}
          </span>
        </div>

        {/* Status progress */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Status</h3>
            {finding.status === "resolved" && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Resolved
              </span>
            )}
          </div>
          <div className="flex items-center overflow-x-auto pb-2">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isLast = idx === statusSteps.length - 1;

              return (
                <div key={step.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : isCurrent
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-1 whitespace-nowrap text-center",
                        isCurrent ? "font-medium text-gray-900" : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 min-w-4",
                        isCompleted ? "bg-green-200" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity banner */}
        <div className={cn("rounded-xl border p-5", severity.bg, severity.border)}>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                severity.iconBg
              )}
            >
              <SeverityIcon className={cn("w-5 h-5", severity.iconColor)} />
            </div>
            <div>
              <h3 className={cn("font-semibold", severity.text)}>
                {severity.label} Issue
              </h3>
              <p className={cn("text-sm mt-0.5", severity.text)}>
                {severity.description}
              </p>
            </div>
          </div>
        </div>

        {/* Photo Evidence */}
        {relatedPhoto && (
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Photo Evidence</h3>
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={relatedPhoto.url}
                  alt="Evidence"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">
                  From inspection on {new Date(relatedPhoto.uploadedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/inspect/${finding.inspectionId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-flex items-center gap-1"
                >
                  View full inspection
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">Details</h3>

          <p className="text-gray-700 whitespace-pre-wrap">{finding.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Site</p>
                <p className="font-medium text-gray-900 truncate">
                  {site?.name || finding.siteName || "Unknown Site"}
                </p>
              </div>
            </div>
            {finding.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900 truncate">
                    {finding.location}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Discovered</p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(finding.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {getCategoryLabel(finding.category)}
                </p>
              </div>
            </div>
          </div>

          {finding.regulation && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Regulation Reference</p>
              <p className="font-mono text-sm text-gray-700 mt-1">
                {finding.regulation}
              </p>
            </div>
          )}
        </div>

        {/* Corrective Actions */}
        <div className="bg-white rounded-xl border">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Corrective Actions</h3>
            {finding.status !== "resolved" && (
              <button
                onClick={() => setShowAssignForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Assign Action
              </button>
            )}
          </div>

          {correctiveActions.length > 0 ? (
            <div className="divide-y">
              {correctiveActions.map((action) => (
                <CorrectiveActionCard
                  key={action._id}
                  action={action}
                  isExpanded={expandedAction === action._id}
                  isVerifying={verifyingAction === action._id}
                  onToggleExpand={() =>
                    setExpandedAction(
                      expandedAction === action._id ? null : action._id
                    )
                  }
                  onStart={() => handleStartAction(action._id)}
                  onComplete={(notes) => handleCompleteAction(action._id, notes)}
                  onVerify={() => setVerifyingAction(action._id)}
                  onConfirmVerify={(approved, notes) =>
                    handleVerifyAction(action._id, approved, notes)
                  }
                  onCancelVerify={() => setVerifyingAction(null)}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No corrective actions yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Assign an action to start the resolution process
              </p>
              {finding.status !== "resolved" && (
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" />
                  Assign Action
                </button>
              )}
            </div>
          )}
        </div>

        {/* Assignment form modal */}
        {showAssignForm && (
          <AssignActionForm
            severity={finding.severity}
            onClose={() => setShowAssignForm(false)}
          />
        )}
      </div>
    </AppShell>
  );
}

function CorrectiveActionCard({
  action,
  isExpanded,
  isVerifying,
  onToggleExpand,
  onStart,
  onComplete,
  onVerify,
  onConfirmVerify,
  onCancelVerify,
}: {
  action: CorrectiveAction;
  isExpanded: boolean;
  isVerifying: boolean;
  onToggleExpand: () => void;
  onStart: () => void;
  onComplete: (notes?: string) => void;
  onVerify: () => void;
  onConfirmVerify: (approved: boolean, notes?: string) => void;
  onCancelVerify: () => void;
}) {
  const [completionNotes, setCompletionNotes] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-gray-100", text: "text-gray-700", label: "Pending" },
    in_progress: { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" },
    completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
  };

  const status = statusConfig[action.status] || statusConfig.pending;
  const isOverdueAction = isOverdue(action.dueDate) && action.status !== "completed";

  const handleComplete = async () => {
    setIsSubmitting(true);
    await onComplete(completionNotes || undefined);
    setIsSubmitting(false);
    setCompletionNotes("");
  };

  const handleVerify = async (approved: boolean) => {
    setIsSubmitting(true);
    await onConfirmVerify(approved, verificationNotes || undefined);
    setIsSubmitting(false);
    setVerificationNotes("");
  };

  return (
    <div className="px-5 py-4">
      {/* Main row */}
      <div className="flex items-start gap-4">
        {/* Status indicator */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            action.status === "completed"
              ? "bg-green-100"
              : action.status === "in_progress"
                ? "bg-amber-100"
                : "bg-gray-100"
          )}
        >
          {action.status === "completed" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : action.status === "in_progress" ? (
            <Play className="w-4 h-4 text-amber-600" />
          ) : (
            <Clock className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium">{action.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
            {action.assignedTo && (
              <span className="flex items-center gap-1 text-gray-500">
                <User className="w-4 h-4" />
                {action.assignedTo}
              </span>
            )}
            {action.dueDate && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  isOverdueAction ? "text-red-600 font-medium" : "text-gray-500"
                )}
              >
                <Clock className="w-4 h-4" />
                {formatDueDate(action.dueDate)}
              </span>
            )}
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.bg, status.text)}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={onToggleExpand}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 ml-12 space-y-4">
          {/* Action buttons based on status */}
          {action.status === "pending" && (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600"
            >
              <Play className="w-4 h-4" />
              Start Work
            </button>
          )}

          {action.status === "in_progress" && !isVerifying && (
            <div className="space-y-3">
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add completion notes (optional)..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Mark Complete
              </button>
            </div>
          )}

          {action.status === "completed" && !isVerifying && (
            <button
              onClick={onVerify}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify Completion
            </button>
          )}

          {/* Verification form */}
          {isVerifying && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900">Verify Completion</h4>
              <p className="text-sm text-gray-600">
                Confirm that the corrective action has been properly completed.
              </p>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add verification notes..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVerify(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleVerify(false)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={onCancelVerify}
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssignActionForm({
  severity,
  onClose,
}: {
  severity: "critical" | "warning";
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    // Set default due date based on severity
    const now = new Date();
    if (severity === "critical") {
      // Due immediately
      return now.toISOString().split("T")[0];
    } else {
      // Due in 2 days
      now.setDate(now.getDate() + 2);
      return now.toISOString().split("T")[0];
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    // Demo mode - just close the form
    console.log("Would create action:", {
      description: description.trim(),
      assignedTo: assignedTo.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
    });
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Assign Corrective Action
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What needs to be done? *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the corrective action required..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Name of responsible person"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {severity === "critical"
                ? "Critical issues should be addressed immediately"
                : "Warning issues should be fixed within 24-48 hours"}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
