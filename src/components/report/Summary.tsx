"use client";

import { cn } from "@/lib/utils";
import { ComplianceDonut } from "@/components/ui/ComplianceDonut";
import { CheckCircle2, AlertTriangle, XCircle, Camera } from "lucide-react";

interface SummaryProps {
  total: number;
  compliant: number;
  warnings: number;
  critical: number;
  className?: string;
}

export function Summary({ total, compliant, warnings, critical, className }: SummaryProps) {
  return (
    <div className={cn("py-16 px-6", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Main score section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Donut Chart */}
          <div className="flex-shrink-0">
            <ComplianceDonut
              total={total}
              compliant={compliant}
              warnings={warnings}
              critical={critical}
              size={220}
            />
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value={total}
                label="Photos Analyzed"
                icon={<Camera className="w-5 h-5" />}
                color="gray"
              />
              <StatCard
                value={compliant}
                label="Compliant"
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="green"
              />
              <StatCard
                value={warnings}
                label="Warnings"
                icon={<AlertTriangle className="w-5 h-5" />}
                color="amber"
              />
              <StatCard
                value={critical}
                label="Critical Issues"
                icon={<XCircle className="w-5 h-5" />}
                color="red"
                highlight={critical > 0}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-100">
          <LegendItem color="#22c55e" label="Compliant" />
          <LegendItem color="#f59e0b" label="Warning" />
          <LegendItem color="#ef4444" label="Critical" />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "green" | "amber" | "red" | "gray";
  highlight?: boolean;
}

function StatCard({ value, label, icon, color, highlight }: StatCardProps) {
  const colorClasses = {
    green: "border-green-200 bg-green-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    red: "border-red-200 bg-red-50/50",
    gray: "border-gray-200 bg-gray-50/50",
  };

  const iconColorClasses = {
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
    gray: "text-gray-600",
  };

  const valueColorClasses = {
    green: "text-green-700",
    amber: "text-amber-700",
    red: "text-red-700",
    gray: "text-gray-900",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 p-5 transition-all",
        colorClasses[color],
        highlight && "ring-2 ring-red-500 ring-offset-2"
      )}
    >
      <div className={cn("mb-2", iconColorClasses[color])}>{icon}</div>
      <div className={cn("text-4xl font-bold tabular-nums", valueColorClasses[color])}>
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      {highlight && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
          ACTION REQUIRED
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
