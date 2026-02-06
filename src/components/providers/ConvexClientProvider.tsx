"use client";

import { ReactNode } from "react";

// Mock provider - no Convex needed for demo
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
