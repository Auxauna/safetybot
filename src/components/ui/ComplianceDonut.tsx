"use client";

import { cn } from "@/lib/utils";

interface ComplianceDonutProps {
  total: number;
  compliant: number;
  warnings: number;
  critical: number;
  size?: number;
  className?: string;
}

export function ComplianceDonut({
  total,
  compliant,
  warnings,
  critical,
  size = 200,
  className,
}: ComplianceDonutProps) {
  const score = total > 0 ? Math.round((compliant / total) * 100) : 0;

  // Calculate percentages for the donut segments
  const compliantPct = total > 0 ? (compliant / total) * 100 : 0;
  const warningsPct = total > 0 ? (warnings / total) * 100 : 0;
  const criticalPct = total > 0 ? (critical / total) * 100 : 0;

  // SVG calculations
  const strokeWidth = size * 0.12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray for each segment
  const compliantDash = (compliantPct / 100) * circumference;
  const warningsDash = (warningsPct / 100) * circumference;
  const criticalDash = (criticalPct / 100) * circumference;

  // Calculate rotation offsets
  const compliantOffset = 0;
  const warningsOffset = compliantDash;
  const criticalOffset = compliantDash + warningsDash;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />

        {/* Critical segment (red) */}
        {criticalPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={`${criticalDash} ${circumference - criticalDash}`}
            strokeDashoffset={-criticalOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Warning segment (amber) */}
        {warningsPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${warningsDash} ${circumference - warningsDash}`}
            strokeDashoffset={-warningsOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Compliant segment (green) */}
        {compliantPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${compliantDash} ${circumference - compliantDash}`}
            strokeDashoffset={-compliantOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-gray-900 tabular-nums">{score}</span>
        <span className="text-lg text-gray-500 -mt-1">% compliant</span>
      </div>
    </div>
  );
}
