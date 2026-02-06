/**
 * Safety Categories for Elevator Field Work
 *
 * Based on OSHA standards, ASME A17.1 codes, and industry best practices.
 * These categories are used for AI photo classification and reporting.
 */

export type CategoryId =
  | "fall_protection"
  | "loto"
  | "electrical"
  | "ppe"
  | "car_top"
  | "pit"
  | "machine_room"
  | "rigging"
  | "housekeeping"
  | "signage";

export type AnalysisStatus = "compliant" | "warning" | "critical" | "unclear";
export type Confidence = "high" | "medium" | "low";

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  description: string;
  keywords: string[];
  lookFor: string[];
  violations: string[];
  whyItMatters: string;
}

export const SAFETY_CATEGORIES: Record<CategoryId, CategoryDefinition> = {
  fall_protection: {
    id: "fall_protection",
    label: "Fall Protection",
    icon: "shield-alert",
    color: "#EF4444", // red-500
    description: "Personal fall arrest systems, guardrails, and work at height",
    keywords: [
      "harness",
      "lanyard",
      "anchor",
      "guardrail",
      "tie-off",
      "fall arrest",
      "height",
      "scaffold",
    ],
    lookFor: [
      "Personal fall arrest systems worn correctly",
      "Lanyards connected to proper anchor points (not elevator cables)",
      "Guardrails in place around openings",
      "Floor holes covered or barricaded",
      "Workers at height (6ft+) with protection",
      "Self-retracting lifelines properly attached",
    ],
    violations: [
      "Working at height without tie-off",
      "Lanyard present but not connected to anchor",
      "Using elevator cables as anchor point (prohibited)",
      "Missing or damaged guardrails",
      "Uncovered floor/shaft openings",
      "Improper anchor point selection",
    ],
    whyItMatters:
      "Falls are the #1 cause of death in construction, accounting for 56% of elevator worker fatalities. Falls into hoistways are particularly deadly.",
  },

  loto: {
    id: "loto",
    label: "Lockout/Tagout",
    icon: "lock",
    color: "#F97316", // orange-500
    description: "Energy isolation and control of hazardous energy",
    keywords: [
      "lock",
      "tag",
      "disconnect",
      "energy",
      "isolation",
      "LOTO",
      "de-energize",
    ],
    lookFor: [
      "Locks on main disconnects",
      "Tags with name, date, and reason",
      "Group lockout devices for multiple workers",
      "LOTO station/board visible",
      "Verification of zero energy state",
      "Written LOTO procedure accessible",
    ],
    violations: [
      "No lock on disconnect during work",
      "Tag only without lock (insufficient)",
      "Working on energized equipment",
      "Incomplete tag information",
      "Removing another person's lock",
      "Failure to identify all energy sources",
    ],
    whyItMatters:
      "50%+ of elevator work deaths are caused by failure to de-energize electrical circuits. LOTO is the most critical safety procedure.",
  },

  electrical: {
    id: "electrical",
    label: "Electrical Safety",
    icon: "zap",
    color: "#EAB308", // yellow-500
    description: "Arc flash protection, panel safety, and electrical work practices",
    keywords: [
      "panel",
      "arc flash",
      "GFCI",
      "wiring",
      "voltage",
      "controller",
      "electrical",
    ],
    lookFor: [
      "Arc flash PPE worn (face shield, gloves, FR clothing)",
      "Panel covers in place",
      "Di-electric mat at control panels",
      "GFCI protection on outlets",
      "Proper grounding",
      "Insulated tools in use",
      "Arc flash labels on equipment",
    ],
    violations: [
      "Working on live circuits without proper PPE",
      "Missing panel covers",
      "No GFCI in wet/damp locations",
      "Exposed wiring or damaged insulation",
      "Missing di-electric mat in machine room",
      "Using non-insulated tools near energized parts",
    ],
    whyItMatters:
      "Electrocution accounts for 7% of elevator worker fatalities. Arc flash can cause severe burns and death in milliseconds.",
  },

  ppe: {
    id: "ppe",
    label: "PPE Compliance",
    icon: "hard-hat",
    color: "#3B82F6", // blue-500
    description: "Personal protective equipment usage and condition",
    keywords: [
      "hard hat",
      "glasses",
      "gloves",
      "vest",
      "boots",
      "PPE",
      "helmet",
      "goggles",
    ],
    lookFor: [
      "Hard hat worn correctly (not backwards, straps adjusted)",
      "Safety glasses or goggles on",
      "Appropriate gloves for task (cut-resistant, insulated)",
      "High-visibility vest when required",
      "Steel-toe boots",
      "Hearing protection in loud areas",
      "PPE in good condition",
    ],
    violations: [
      "No hard hat in active work area",
      "Safety glasses missing or on forehead",
      "Wrong glove type for task",
      "Damaged or expired PPE",
      "Improperly worn PPE",
      "Missing hi-vis in traffic areas",
    ],
    whyItMatters:
      "Proper PPE can prevent 70% of construction injuries. Head protection is critical when working around overhead hazards and moving equipment.",
  },

  car_top: {
    id: "car_top",
    label: "Car Top Safety",
    icon: "box",
    color: "#8B5CF6", // purple-500
    description: "Elevator car top work procedures and conditions",
    keywords: [
      "car top",
      "elevator",
      "hoistway",
      "stop switch",
      "inspection",
      "TCOD",
    ],
    lookFor: [
      "Car top inspection station operational",
      "Stop switch tested before access",
      "Fall protection anchor points used",
      "Proper lighting on car top",
      "Guardrails or chains around perimeter",
      "Clearance from overhead equipment verified",
      "Top-of-car operating device (TCOD) in use",
    ],
    violations: [
      "Riding car top without stop switch verification",
      "No fall protection at height",
      "Overhead clearance hazards not identified",
      "Missing car top guardrails",
      "Poor lighting for work",
      "TCOD not properly engaged",
    ],
    whyItMatters:
      "Car top work combines fall and struck-by hazards. Workers can be crushed by counterweights or fall into the hoistway.",
  },

  pit: {
    id: "pit",
    label: "Pit Safety",
    icon: "arrow-down",
    color: "#06B6D4", // cyan-500
    description: "Elevator pit conditions, access, and safety equipment",
    keywords: ["pit", "ladder", "lighting", "stop switch", "water", "sump"],
    lookFor: [
      "Pit stop switch accessible and operational",
      "Adequate lighting (min 10 foot-candles)",
      "GFCI outlets present and working",
      "Ladder in good condition with proper clearance",
      "Clean and dry conditions",
      "Proper clearance beneath car",
      "No debris or standing water",
    ],
    violations: [
      "Standing water in pit",
      "Inadequate lighting",
      "Blocked or inaccessible stop switch",
      "Missing or damaged ladder",
      "Oil/hydraulic fluid leaks",
      "Debris accumulation",
      "Insufficient clearance",
    ],
    whyItMatters:
      "Pit work exposes workers to caught-in hazards from moving equipment. Poor conditions increase slip, trip, and fall risks.",
  },

  machine_room: {
    id: "machine_room",
    label: "Machine Room",
    icon: "settings",
    color: "#6B7280", // gray-500
    description: "Equipment room conditions, temperature, and housekeeping",
    keywords: [
      "machine room",
      "controller",
      "ventilation",
      "temperature",
      "motor",
    ],
    lookFor: [
      "Room clean and organized",
      "Temperature within range (55-90°F)",
      "Fire extinguisher present and inspected",
      "No unauthorized storage",
      "Proper clearances maintained (18\" minimum)",
      "Di-electric mat at control panels",
      "Door secured and properly labeled",
      "Adequate ventilation",
    ],
    violations: [
      "Room used for non-elevator storage",
      "Temperature extremes (no HVAC)",
      "Missing or expired fire extinguisher",
      "Blocked access to equipment",
      "Poor housekeeping",
      "Missing di-electric mat",
      "Plumbing routed through room",
    ],
    whyItMatters:
      "Machine room conditions affect equipment reliability and worker safety. Overheating can cause equipment failure; clutter creates hazards.",
  },

  rigging: {
    id: "rigging",
    label: "Rigging & Hoisting",
    icon: "anchor",
    color: "#6366F1", // indigo-500
    description: "Slings, wire rope, hoisting equipment, and lifting operations",
    keywords: ["sling", "rope", "hoist", "rigging", "chain", "lift", "crane"],
    lookFor: [
      "Slings in good condition (no visible damage)",
      "Wire rope inspected (no broken wires, kinks, bird-caging)",
      "Proper rigging configuration for load",
      "Load within rated capacity",
      "Tag lines used for load control",
      "Rigging hardware in good condition",
      "Qualified rigger present",
    ],
    violations: [
      "Damaged or worn slings in use",
      "Exceeding working load limit",
      "Improper rigging configuration",
      "No load calculations",
      "Missing softeners on sharp edges",
      "Shock loading",
      "Spliced wire rope (prohibited)",
    ],
    whyItMatters:
      "Rigging failures cause struck-by fatalities. Wire rope must be inspected daily; slings removed from service when damaged.",
  },

  housekeeping: {
    id: "housekeeping",
    label: "Housekeeping",
    icon: "trash-2",
    color: "#22C55E", // green-500
    description: "Work area cleanliness, organization, and egress",
    keywords: ["debris", "clean", "organized", "egress", "tools", "clutter"],
    lookFor: [
      "Work area clean and organized",
      "Tools properly stored after use",
      "Clear egress paths maintained",
      "Debris removed from work area",
      "Cords and cables managed (no trip hazards)",
      "Proper waste disposal",
    ],
    violations: [
      "Debris in hoistway or pit",
      "Tools and materials scattered",
      "Blocked emergency exits",
      "Trip hazards from cords",
      "Improper waste disposal",
      "Oily rags not properly stored",
    ],
    whyItMatters:
      "Poor housekeeping causes slips, trips, and falls - among the most common workplace injuries. It also indicates overall safety culture.",
  },

  signage: {
    id: "signage",
    label: "Signage & HazCom",
    icon: "alert-triangle",
    color: "#F59E0B", // amber-500
    description: "Warning signs, labels, barricades, and hazard communication",
    keywords: ["sign", "label", "barricade", "warning", "tag", "hazard"],
    lookFor: [
      "Warning signs posted appropriately",
      "Proper barricading around hazards",
      "Equipment labels legible",
      "LOTO tags complete and visible",
      "Safety data sheets accessible",
      "Inspection tags current",
    ],
    violations: [
      "Missing warning signage",
      "No barricades around open hoistway",
      "Illegible or faded labels",
      "Incomplete LOTO tags",
      "Expired inspection tags",
      "Unlabeled hazardous materials",
    ],
    whyItMatters:
      "Proper signage and communication prevent accidents by alerting workers to hazards before they encounter them.",
  },
};

// Helper functions
export function getCategoryById(id: CategoryId): CategoryDefinition {
  return SAFETY_CATEGORIES[id];
}

export function getCategoryLabel(id: CategoryId): string {
  return SAFETY_CATEGORIES[id]?.label ?? id;
}

export function getCategoryColor(id: CategoryId): string {
  return SAFETY_CATEGORIES[id]?.color ?? "#6B7280";
}

export function getAllCategories(): CategoryDefinition[] {
  return Object.values(SAFETY_CATEGORIES);
}

export function getStatusColor(status: AnalysisStatus): string {
  switch (status) {
    case "compliant":
      return "#22C55E"; // green
    case "warning":
      return "#F59E0B"; // amber
    case "critical":
      return "#EF4444"; // red
    case "unclear":
      return "#6B7280"; // gray
  }
}

export function getStatusLabel(status: AnalysisStatus): string {
  switch (status) {
    case "compliant":
      return "Compliant";
    case "warning":
      return "Needs Attention";
    case "critical":
      return "Critical Issue";
    case "unclear":
      return "Unable to Determine";
  }
}
