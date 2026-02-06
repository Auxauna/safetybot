"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "border border-gray-200 bg-white text-gray-700",
        success: "border border-green-200 bg-green-50 text-green-700",
        warning: "border border-amber-200 bg-amber-50 text-amber-700",
        critical: "border border-red-200 bg-red-50 text-red-700",
        info: "border border-blue-200 bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CategoryBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function CategoryBadge({ children, variant, className }: CategoryBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      <span className="w-2 h-2 rounded-sm bg-current" />
      {children}
    </span>
  );
}

// Status badge for analysis results
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold",
  {
    variants: {
      status: {
        compliant: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        critical: "bg-red-100 text-red-800",
        unclear: "bg-gray-100 text-gray-600",
        pending: "bg-gray-100 text-gray-500",
        analyzing: "bg-blue-100 text-blue-700",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface StatusBadgeProps {
  status: "compliant" | "warning" | "critical" | "unclear" | "pending" | "analyzing";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const labels = {
    compliant: "Compliant",
    warning: "Warning",
    critical: "Critical",
    unclear: "Unclear",
    pending: "Pending",
    analyzing: "Analyzing...",
  };

  const icons = {
    compliant: "✓",
    warning: "⚠",
    critical: "✕",
    unclear: "?",
    pending: "○",
    analyzing: "◐",
  };

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      <span>{icons[status]}</span>
      {labels[status]}
    </span>
  );
}
