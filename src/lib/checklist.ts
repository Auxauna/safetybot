/**
 * Elevator Safety Inspection Checklist
 * Based on ASME A17.1/A17.2 standards and OSHA requirements
 */

export type ChecklistStatus = "pass" | "fail" | "warning" | "not_inspected";

export interface ChecklistItem {
  id: string;
  code: string; // e.g., "MR-01", "CT-03"
  requirement: string;
  category: ChecklistCategory;
  regulation?: string; // ASME/OSHA reference
  criticalSafety: boolean; // Immediate stop-work if failed
}

export interface ChecklistResult extends ChecklistItem {
  status: ChecklistStatus;
  photoIds: string[]; // Photos that serve as evidence
  notes?: string;
  aiConfidence?: "high" | "medium" | "low";
}

export type ChecklistCategory =
  | "machine_room"
  | "car_top"
  | "hoistway"
  | "pit"
  | "car_interior"
  | "safety_devices"
  | "loto"
  | "ppe";

export interface CategoryMeta {
  id: ChecklistCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Record<ChecklistCategory, CategoryMeta> = {
  machine_room: {
    id: "machine_room",
    label: "Machine Room",
    shortLabel: "MR",
    description: "Equipment room conditions, access, and fire safety",
    icon: "server",
  },
  car_top: {
    id: "car_top",
    label: "Car Top",
    shortLabel: "CT",
    description: "Top of car inspection, cables, and stop switches",
    icon: "box",
  },
  hoistway: {
    id: "hoistway",
    label: "Hoistway",
    shortLabel: "HW",
    description: "Shaft conditions, clearances, and access",
    icon: "arrow-up-down",
  },
  pit: {
    id: "pit",
    label: "Pit",
    shortLabel: "PT",
    description: "Pit conditions, lighting, ladder, and stop switch",
    icon: "arrow-down",
  },
  car_interior: {
    id: "car_interior",
    label: "Car Interior",
    shortLabel: "CI",
    description: "Inside car condition, controls, and emergency equipment",
    icon: "square",
  },
  safety_devices: {
    id: "safety_devices",
    label: "Safety Devices",
    shortLabel: "SD",
    description: "Governors, buffers, door sensors, and safety circuits",
    icon: "shield",
  },
  loto: {
    id: "loto",
    label: "Lockout/Tagout",
    shortLabel: "LO",
    description: "Energy isolation and control procedures",
    icon: "lock",
  },
  ppe: {
    id: "ppe",
    label: "PPE Compliance",
    shortLabel: "PP",
    description: "Personal protective equipment usage",
    icon: "hard-hat",
  },
};

/**
 * Standard Elevator Safety Checklist
 * Based on ASME A17.1-2022 and A17.2-2023 inspection requirements
 */
export const ELEVATOR_CHECKLIST: ChecklistItem[] = [
  // Machine Room (MR)
  {
    id: "mr-01",
    code: "MR-01",
    requirement: "Machine room door self-closes and locks properly",
    category: "machine_room",
    regulation: "ASME A17.1 2.7.3",
    criticalSafety: false,
  },
  {
    id: "mr-02",
    code: "MR-02",
    requirement: "Adequate lighting (min 10 foot-candles at floor)",
    category: "machine_room",
    regulation: "ASME A17.1 2.7.6",
    criticalSafety: false,
  },
  {
    id: "mr-03",
    code: "MR-03",
    requirement: "Room is clean and free of non-elevator storage",
    category: "machine_room",
    regulation: "ASME A17.1 2.7.1",
    criticalSafety: false,
  },
  {
    id: "mr-04",
    code: "MR-04",
    requirement: "Temperature within acceptable range (55-90°F)",
    category: "machine_room",
    regulation: "ASME A17.1 2.7.9",
    criticalSafety: false,
  },
  {
    id: "mr-05",
    code: "MR-05",
    requirement: "Fire extinguisher present and inspection current",
    category: "machine_room",
    regulation: "Local Fire Code",
    criticalSafety: false,
  },
  {
    id: "mr-06",
    code: "MR-06",
    requirement: "Di-electric mat in place at controller",
    category: "machine_room",
    regulation: "OSHA 1910.303",
    criticalSafety: false,
  },
  {
    id: "mr-07",
    code: "MR-07",
    requirement: "Smoke detector installed and functional",
    category: "machine_room",
    regulation: "ASME A17.1 2.27.2",
    criticalSafety: false,
  },
  {
    id: "mr-08",
    code: "MR-08",
    requirement: "Minimum 18\" clearance maintained around equipment",
    category: "machine_room",
    regulation: "OSHA 1910.303(g)",
    criticalSafety: false,
  },

  // Car Top (CT)
  {
    id: "ct-01",
    code: "CT-01",
    requirement: "Car top stop switch tested and operational",
    category: "car_top",
    regulation: "ASME A17.1 2.26.1.4",
    criticalSafety: true,
  },
  {
    id: "ct-02",
    code: "CT-02",
    requirement: "Top-of-car operating device (TCOD) functional",
    category: "car_top",
    regulation: "ASME A17.1 2.26.1",
    criticalSafety: true,
  },
  {
    id: "ct-03",
    code: "CT-03",
    requirement: "Car top guardrails/balustrade in place",
    category: "car_top",
    regulation: "ASME A17.1 2.14.1.7",
    criticalSafety: true,
  },
  {
    id: "ct-04",
    code: "CT-04",
    requirement: "Adequate lighting on car top",
    category: "car_top",
    regulation: "ASME A17.1 2.26.1.5",
    criticalSafety: false,
  },
  {
    id: "ct-05",
    code: "CT-05",
    requirement: "Hoist ropes in acceptable condition (no broken wires)",
    category: "car_top",
    regulation: "ASME A17.1 2.20.9",
    criticalSafety: true,
  },
  {
    id: "ct-06",
    code: "CT-06",
    requirement: "Overhead clearance verified safe",
    category: "car_top",
    regulation: "ASME A17.1 2.4.3",
    criticalSafety: true,
  },

  // Pit (PT)
  {
    id: "pt-01",
    code: "PT-01",
    requirement: "Pit stop switch accessible and operational",
    category: "pit",
    regulation: "ASME A17.1 2.2.6",
    criticalSafety: true,
  },
  {
    id: "pt-02",
    code: "PT-02",
    requirement: "Adequate pit lighting (min 10 foot-candles)",
    category: "pit",
    regulation: "ASME A17.1 2.2.5",
    criticalSafety: false,
  },
  {
    id: "pt-03",
    code: "PT-03",
    requirement: "Pit ladder present and in good condition",
    category: "pit",
    regulation: "ASME A17.1 2.2.4",
    criticalSafety: false,
  },
  {
    id: "pt-04",
    code: "PT-04",
    requirement: "GFCI outlet present and functional",
    category: "pit",
    regulation: "ASME A17.1 2.2.5",
    criticalSafety: false,
  },
  {
    id: "pt-05",
    code: "PT-05",
    requirement: "Pit clean and free of water/debris",
    category: "pit",
    regulation: "ASME A17.1 2.2.2",
    criticalSafety: false,
  },
  {
    id: "pt-06",
    code: "PT-06",
    requirement: "Buffer springs/oil buffers in acceptable condition",
    category: "pit",
    regulation: "ASME A17.1 2.22",
    criticalSafety: true,
  },
  {
    id: "pt-07",
    code: "PT-07",
    requirement: "Proper running clearance below car",
    category: "pit",
    regulation: "ASME A17.1 2.4.4",
    criticalSafety: true,
  },

  // Safety Devices (SD)
  {
    id: "sd-01",
    code: "SD-01",
    requirement: "Governor rope and sheave in good condition",
    category: "safety_devices",
    regulation: "ASME A17.1 2.18",
    criticalSafety: true,
  },
  {
    id: "sd-02",
    code: "SD-02",
    requirement: "Door restrictor device operational",
    category: "safety_devices",
    regulation: "ASME A17.1 2.13.4",
    criticalSafety: true,
  },
  {
    id: "sd-03",
    code: "SD-03",
    requirement: "Door protective device (sensor) functional",
    category: "safety_devices",
    regulation: "ASME A17.1 2.13.5",
    criticalSafety: false,
  },
  {
    id: "sd-04",
    code: "SD-04",
    requirement: "Emergency stop buttons operational",
    category: "safety_devices",
    regulation: "ASME A17.1 2.27",
    criticalSafety: true,
  },

  // Car Interior (CI)
  {
    id: "ci-01",
    code: "CI-01",
    requirement: "Emergency communication device tested",
    category: "car_interior",
    regulation: "ASME A17.1 2.27.1.1",
    criticalSafety: true,
  },
  {
    id: "ci-02",
    code: "CI-02",
    requirement: "Car operating panel buttons/indicators functional",
    category: "car_interior",
    regulation: "ASME A17.1 2.27.3",
    criticalSafety: false,
  },
  {
    id: "ci-03",
    code: "CI-03",
    requirement: "Adequate car lighting (min 5 foot-candles)",
    category: "car_interior",
    regulation: "ASME A17.1 2.14.7",
    criticalSafety: false,
  },
  {
    id: "ci-04",
    code: "CI-04",
    requirement: "Door closing force within limits",
    category: "car_interior",
    regulation: "ASME A17.1 2.13.4",
    criticalSafety: false,
  },

  // LOTO (LO)
  {
    id: "lo-01",
    code: "LO-01",
    requirement: "Personal lock applied to main disconnect",
    category: "loto",
    regulation: "OSHA 1910.147",
    criticalSafety: true,
  },
  {
    id: "lo-02",
    code: "LO-02",
    requirement: "Tag with name, date, and reason attached",
    category: "loto",
    regulation: "OSHA 1910.147(c)(5)",
    criticalSafety: true,
  },
  {
    id: "lo-03",
    code: "LO-03",
    requirement: "Zero energy state verified before work",
    category: "loto",
    regulation: "OSHA 1910.147(d)(6)",
    criticalSafety: true,
  },

  // PPE (PP)
  {
    id: "pp-01",
    code: "PP-01",
    requirement: "Hard hats worn by all personnel",
    category: "ppe",
    regulation: "OSHA 1926.100",
    criticalSafety: false,
  },
  {
    id: "pp-02",
    code: "PP-02",
    requirement: "Safety glasses/eye protection worn",
    category: "ppe",
    regulation: "OSHA 1926.102",
    criticalSafety: false,
  },
  {
    id: "pp-03",
    code: "PP-03",
    requirement: "Fall protection used when required (6ft+ height)",
    category: "ppe",
    regulation: "OSHA 1926.501",
    criticalSafety: true,
  },
  {
    id: "pp-04",
    code: "PP-04",
    requirement: "Proper footwear (steel toe if required)",
    category: "ppe",
    regulation: "OSHA 1910.136",
    criticalSafety: false,
  },
];

// Helper functions
export function getChecklistByCategory(category: ChecklistCategory): ChecklistItem[] {
  return ELEVATOR_CHECKLIST.filter((item) => item.category === category);
}

export function getCriticalItems(): ChecklistItem[] {
  return ELEVATOR_CHECKLIST.filter((item) => item.criticalSafety);
}

export function getCategoryStats(results: ChecklistResult[], category: ChecklistCategory) {
  const items = results.filter((r) => r.category === category);
  return {
    total: items.length,
    pass: items.filter((r) => r.status === "pass").length,
    fail: items.filter((r) => r.status === "fail").length,
    warning: items.filter((r) => r.status === "warning").length,
    notInspected: items.filter((r) => r.status === "not_inspected").length,
  };
}
