"use client";

import { cn } from "@/lib/utils";

interface SectionProps {
  number: number;
  total: number;
  label: string;
  children: React.ReactNode;
  withGrid?: boolean;
  className?: string;
}

export function Section({
  number,
  total,
  label,
  children,
  withGrid = false,
  className,
}: SectionProps) {
  return (
    <section className={cn("border-t border-gray-200", className)}>
      <div className="px-6 py-4 text-sm text-gray-500 font-mono tracking-tight">
        [ {String(number).padStart(2, "0")} of {String(total).padStart(2, "0")} ] • {label}
      </div>
      <div className={cn(withGrid && "bg-grid")}>{children}</div>
    </section>
  );
}
