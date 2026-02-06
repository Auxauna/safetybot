"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoBannerProps {
  children: React.ReactNode;
  className?: string;
}

export function DemoBanner({ children, className }: DemoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600",
        className
      )}
    >
      <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <p>{children}</p>
    </div>
  );
}
