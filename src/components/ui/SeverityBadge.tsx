"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "compliant" | "unclear";

interface SeverityBadgeProps {
  severity: Severity | string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const config: Record<Severity, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  critical: {
    label: "Critical",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: AlertCircle,
  },
  warning: {
    label: "Warning",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: AlertTriangle,
  },
  compliant: {
    label: "Compliant",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle2,
  },
  unclear: {
    label: "Unclear",
    bg: "bg-gray-100",
    text: "text-gray-600",
    icon: HelpCircle,
  },
};

export function SeverityBadge({
  severity,
  size = "md",
  showIcon = true,
  className,
}: SeverityBadgeProps) {
  const cfg = config[severity as Severity] || config.unclear;
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        cfg.bg,
        cfg.text,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1",
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      {cfg.label}
    </span>
  );
}
