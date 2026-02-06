// OSHA Construction Safety Categories based on 29 CFR 1926

export type CategoryId =
  | "fall_protection"
  | "scaffolding"
  | "electrical"
  | "excavation"
  | "ppe"
  | "ladders"
  | "cranes_rigging"
  | "confined_space"
  | "housekeeping"
  | "fire_prevention"
  | "hazcom"
  | "tools_equipment";

export interface Category {
  id: CategoryId;
  label: string;
  shortLabel: string;
  regulation: string;
  isCritical: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const CONSTRUCTION_CATEGORIES: Record<CategoryId, Category> = {
  fall_protection: {
    id: "fall_protection",
    label: "Fall Protection",
    shortLabel: "Fall",
    regulation: "29 CFR 1926.500-.503",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "shield-alert",
  },
  scaffolding: {
    id: "scaffolding",
    label: "Scaffolding",
    shortLabel: "Scaffold",
    regulation: "29 CFR 1926.450-.454",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "layers",
  },
  electrical: {
    id: "electrical",
    label: "Electrical Safety",
    shortLabel: "Electrical",
    regulation: "29 CFR 1926.400-.449",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "zap",
  },
  excavation: {
    id: "excavation",
    label: "Excavation",
    shortLabel: "Excavation",
    regulation: "29 CFR 1926.650-.652",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "construction",
  },
  ppe: {
    id: "ppe",
    label: "PPE Compliance",
    shortLabel: "PPE",
    regulation: "29 CFR 1926.95-.107",
    isCritical: false,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "hard-hat",
  },
  ladders: {
    id: "ladders",
    label: "Ladders",
    shortLabel: "Ladders",
    regulation: "29 CFR 1926.1050-.1060",
    isCritical: false,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "git-branch",
  },
  cranes_rigging: {
    id: "cranes_rigging",
    label: "Cranes & Rigging",
    shortLabel: "Cranes",
    regulation: "29 CFR 1926.1400-.1442",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "anchor",
  },
  confined_space: {
    id: "confined_space",
    label: "Confined Space",
    shortLabel: "Confined",
    regulation: "29 CFR 1926.1200-.1213",
    isCritical: true,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "box",
  },
  housekeeping: {
    id: "housekeeping",
    label: "Housekeeping",
    shortLabel: "Housekeeping",
    regulation: "29 CFR 1926.25",
    isCritical: false,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: "trash-2",
  },
  fire_prevention: {
    id: "fire_prevention",
    label: "Fire Prevention",
    shortLabel: "Fire",
    regulation: "29 CFR 1926.150-.159",
    isCritical: false,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: "flame",
  },
  hazcom: {
    id: "hazcom",
    label: "HazCom",
    shortLabel: "HazCom",
    regulation: "29 CFR 1926.59",
    isCritical: false,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: "alert-triangle",
  },
  tools_equipment: {
    id: "tools_equipment",
    label: "Tools & Equipment",
    shortLabel: "Tools",
    regulation: "29 CFR 1926.300-.307",
    isCritical: false,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: "wrench",
  },
};

export const CATEGORY_LIST = Object.values(CONSTRUCTION_CATEGORIES);

export const CRITICAL_CATEGORIES = CATEGORY_LIST.filter((c) => c.isCritical);

export function getCategoryById(id: string): Category | undefined {
  return CONSTRUCTION_CATEGORIES[id as CategoryId];
}

export function getCategoryLabel(id: string): string {
  return CONSTRUCTION_CATEGORIES[id as CategoryId]?.label || id;
}

export function isCriticalCategory(id: string): boolean {
  return CONSTRUCTION_CATEGORIES[id as CategoryId]?.isCritical || false;
}

// Severity levels for findings
export const SEVERITY_LEVELS = {
  critical: {
    label: "Critical",
    description: "Stop work immediately",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
  serious: {
    label: "Serious",
    description: "Correct within 24 hours",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
  },
  minor: {
    label: "Minor",
    description: "Correct within 7 days",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_LEVELS;

// Response types for checklist items
export const RESPONSE_TYPES = {
  pass: {
    label: "Pass",
    shortLabel: "Pass",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    icon: "check",
  },
  fail: {
    label: "Fail",
    shortLabel: "Fail",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    icon: "x",
  },
  warning: {
    label: "Warning",
    shortLabel: "Warn",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    icon: "alert-triangle",
  },
  na: {
    label: "N/A",
    shortLabel: "N/A",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    icon: "minus",
  },
  pending: {
    label: "Pending",
    shortLabel: "...",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: "circle",
  },
} as const;

export type ResponseType = keyof typeof RESPONSE_TYPES;
