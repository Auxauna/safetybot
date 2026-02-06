"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "critical" | "warning" | "success";
  href?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const variants = {
    default: {
      container: "bg-white",
      icon: "bg-gray-100 text-gray-600",
      value: "text-gray-900",
    },
    critical: {
      container: "bg-red-50 border-red-100",
      icon: "bg-red-100 text-red-600",
      value: "text-red-700",
    },
    warning: {
      container: "bg-amber-50 border-amber-100",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-700",
    },
    success: {
      container: "bg-green-50 border-green-100",
      icon: "bg-green-100 text-green-600",
      value: "text-green-700",
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow hover:shadow-sm",
        styles.container
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={cn("text-3xl font-bold mt-1 tabular-nums", styles.value)}>
            {value}
          </p>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            styles.icon
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
