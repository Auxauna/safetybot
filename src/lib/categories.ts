/**
 * Safety Categories for Elevator Field Work
 *
 * Based on FPP (Field Performance Plan) categories used in Safety Blitz assessments.
 * These categories align with real-world elevator safety audits covering
 * fall protection, LOTO, hoistway access, electrical, PPE, rigging, and more.
 */

export type CategoryId =
  | "fall_protection"
  | "loto"
  | "electrical"
  | "ppe"
  | "car_top"
  | "pit"
  | "machine_room"
  | "hoisting_rigging"
  | "housekeeping"
  | "barricades"
  | "hoistway_access"
  | "warehouse"
  | "mechanical"
  | "jumpers";

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
    description:
      "Personal fall arrest systems, guardrails, hoistway screening, and work at height",
    keywords: [
      "harness",
      "lanyard",
      "anchor",
      "guardrail",
      "tie-off",
      "fall arrest",
      "height",
      "hoistway",
      "screening",
      "toe board",
    ],
    lookFor: [
      "Personal fall arrest systems worn and fitted correctly",
      "Lanyards connected to proper anchor points",
      "Adequate screening at hoistway openings",
      "Guardrails properly installed around openings",
      "Toe boards in place where required",
      "No loose material inside hoistway",
      "Harness properly fitted (snug, no twisted straps)",
      "Level 2 barriers over hoistway below",
    ],
    violations: [
      "Inadequate screening at hoistway opening",
      "Hoistway opening secured only with zip ties",
      "Harness not fit properly",
      "Exposed hole in hoistway",
      "No toe board at hoistway edge",
      "Loose material inside hoistway",
      "Fall protection used improperly",
      "Non-removable barricade blocking egress",
      "Dropped object potential not addressed",
    ],
    whyItMatters:
      "Falls are the #1 cause of death in construction and account for a majority of elevator worker fatalities. Falls into hoistways are particularly deadly. Proper screening and fall arrest are critical SIF prevention controls.",
  },

  loto: {
    id: "loto",
    label: "Lockout/Tagout",
    icon: "lock",
    color: "#F97316", // orange-500
    description:
      "Energy isolation, LOTO procedures, Live-Dead-Live testing, and arc flash protection",
    keywords: [
      "lock",
      "tag",
      "disconnect",
      "energy",
      "isolation",
      "LOTO",
      "de-energize",
      "arc flash",
      "LDL",
      "meter",
    ],
    lookFor: [
      "Personal locks on disconnects",
      "LOTO tags with name, hazard, and contact info",
      "Live-Dead-Live (LDL) testing achieved",
      "Correct meter and meter leads used",
      "One-hand testing technique practiced",
      "Arc rated gloves and sleeves used",
      "Insulated mat at controller",
      "No metallic objects (keys, belt buckles) near energized equipment",
      "Hasp functional for group lockout",
    ],
    violations: [
      "Missing LOTO tags with name, hazard, and contact info",
      "Multiple employees using only one lock",
      "Two hands in controller (should be single-hand operation)",
      "Incorrect meter leads",
      "No hand hold on disconnect",
      "Metallic objects not removed (keys hanging, metal belt)",
      "Hasp won't work or not available",
      "Lock not accessible when needed",
      "Shielding to wire hanging by incoming leads",
      "Arc rated gloves and sleeves not used",
    ],
    whyItMatters:
      "Electrical contact is a leading cause of elevator worker fatalities. Proper LOTO with Live-Dead-Live verification is the most critical safety procedure. Every worker must have their own lock on every disconnect.",
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
      "disconnect",
    ],
    lookFor: [
      "Arc flash PPE worn (face shield, gloves, FR clothing)",
      "Panel covers in place",
      "Di-electric mat at control panels",
      "GFCI protection on outlets",
      "Proper grounding",
      "Insulated tools in use",
      "Arc flash labels on equipment",
      "Single-hand operation near energized parts",
    ],
    violations: [
      "Working on live circuits without proper PPE",
      "Missing panel covers",
      "No GFCI in wet/damp locations",
      "Exposed wiring or damaged insulation",
      "Missing di-electric mat in machine room",
      "Using non-insulated tools near energized parts",
      "Two hands in controller simultaneously",
    ],
    whyItMatters:
      "Electrocution is a significant cause of elevator worker fatalities. Arc flash can cause severe burns and death in milliseconds. Proper PPE and single-hand technique are essential.",
  },

  ppe: {
    id: "ppe",
    label: "PPE Compliance",
    icon: "hard-hat",
    color: "#3B82F6", // blue-500
    description:
      "Personal protective equipment usage, condition, and compliance",
    keywords: [
      "hard hat",
      "glasses",
      "gloves",
      "vest",
      "boots",
      "PPE",
      "helmet",
      "goggles",
      "arc rated",
      "cut level",
    ],
    lookFor: [
      "Hard hat worn correctly with chin strap",
      "Prescription safety glasses worn",
      "Cut level 4 gloves for appropriate tasks",
      "Arc rated gloves and sleeves for electrical work",
      "Proper glove sizes available for all employees",
      "High-visibility vest when required",
      "Steel-toe boots",
      "PPE in good condition and properly fitted",
    ],
    violations: [
      "Arc rated gloves and sleeves not being used during audits",
      "Cut level 4 gloves not available or not worn",
      "Insufficient glove sizes for employees",
      "Prescription safety glasses missing",
      "Harness not properly fitted",
      "Chin strap not used",
      "PPE program not applied 100% of the time",
      "Damaged or expired PPE in use",
    ],
    whyItMatters:
      "Proper PPE is a zero-tolerance requirement. Every worker must have correctly sized and rated PPE for their specific task. Gloves, sleeves, and eye protection prevent the most common injuries.",
  },

  car_top: {
    id: "car_top",
    label: "Car Top Safety",
    icon: "box",
    color: "#8B5CF6", // purple-500
    description: "Elevator car top work procedures, access, and conditions",
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
      "Door not exceeding 6 inches for cartop access",
    ],
    violations: [
      "Riding car top without stop switch verification",
      "No fall protection at height",
      "Overhead clearance hazards not identified",
      "Missing car top guardrails",
      "Poor lighting for work",
      "TCOD not properly engaged",
      "Cartop access door exceeding 6 inches",
    ],
    whyItMatters:
      "Car top work combines fall and struck-by hazards. Workers can be crushed by counterweights or fall into the hoistway. Stop switch verification is mandatory before every access.",
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
      "Temperature within range (55-90 F)",
      "Fire extinguisher present and inspected",
      "No unauthorized storage",
      "Proper clearances maintained (18 inch minimum)",
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

  hoisting_rigging: {
    id: "hoisting_rigging",
    label: "Hoisting & Rigging",
    icon: "anchor",
    color: "#6366F1", // indigo-500
    description:
      "Slings, wire rope, hoisting equipment, rigging plans, and lifting operations",
    keywords: [
      "sling",
      "rope",
      "hoist",
      "rigging",
      "chain",
      "lift",
      "crane",
      "rigging plan",
      "softener",
    ],
    lookFor: [
      "Hoisting/rigging plan in place",
      "Slings in good condition and inspected prior to use",
      "Softeners on sharp edges",
      "Wire rope inspected (no broken wires, kinks, bird-caging)",
      "Proper rigging configuration for load",
      "Load within rated capacity",
      "Tag lines used for load control",
      "Qualified rigger present",
      "Gloves worn during rigging operations",
    ],
    violations: [
      "No hoisting/rigging plan",
      "No gloves during rigging",
      "Rigging on sharp edge without softener",
      "Slings not inspected prior to use",
      "Damaged strap in use",
      "Exceeding working load limit",
      "Improper rigging configuration",
      "No load calculations",
    ],
    whyItMatters:
      "Rigging failures cause struck-by fatalities. Every lift requires a plan, and all rigging equipment must be inspected before each use. Citations can be issued for non-compliance.",
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
      "Poor housekeeping causes slips, trips, and falls and indicates overall safety culture.",
  },

  barricades: {
    id: "barricades",
    label: "Barricades & Signage",
    icon: "alert-triangle",
    color: "#F59E0B", // amber-500
    description:
      "Barricading, screening, warning signs, labels, and hazard communication",
    keywords: [
      "barricade",
      "screening",
      "sign",
      "label",
      "warning",
      "tag",
      "hazard",
      "canopy",
    ],
    lookFor: [
      "Barricades properly installed at openings",
      "Screening adequate at hoistway openings",
      "Canopy in place where required",
      "Warning signs posted appropriately",
      "Equipment labels legible",
      "LOTO tags complete and visible",
      "Inspection tags current",
    ],
    violations: [
      "Barricades not in place at hoistway",
      "Inadequate screening at hoistway opening",
      "No canopy installed where required",
      "Missing warning signage",
      "Illegible or faded labels",
      "Incomplete LOTO tags",
      "Expired inspection tags",
    ],
    whyItMatters:
      "Proper barricading and screening prevent falls into hoistways and protect the public. This is a critical SIF prevention control that requires daily confirmation.",
  },

  hoistway_access: {
    id: "hoistway_access",
    label: "Hoistway Access",
    icon: "door-open",
    color: "#EC4899", // pink-500
    description:
      "Hoistway entry procedures, barricading, stop switch verification, and door protocols",
    keywords: [
      "hoistway",
      "barricade",
      "stop switch",
      "guardrail",
      "door",
      "peek",
      "access",
      "foot wedge",
    ],
    lookFor: [
      "Barricades in place before hoistway access",
      "Stop switch independently tested before entry",
      "Guard rail properly installed",
      "6-inch door peek protocol followed",
      "Verification of elevator position before entry",
      "No foot wedge used improperly",
      "Top lobby secured with lock and hasp",
    ],
    violations: [
      "Barricades not in place before hoistway access",
      "Stop switch verification not performed",
      "Improper guard rail installation",
      "Failed 6-inch peek protocol at disconnect",
      "Top lobby unsecured (lacking lock and hasp)",
      "Foot wedge used improperly",
      "No verification of car position",
    ],
    whyItMatters:
      "Hoistway access is one of the most dangerous moments in elevator work. Workers must verify car position and test stop switches independently every time. Failure can result in fatal crush injuries.",
  },

  warehouse: {
    id: "warehouse",
    label: "Warehouse",
    icon: "warehouse",
    color: "#78716C", // stone-500
    description:
      "Warehouse conditions, storage, forklift operations, and material handling",
    keywords: [
      "warehouse",
      "forklift",
      "storage",
      "spill",
      "containment",
      "lighting",
      "material",
    ],
    lookFor: [
      "Adequate lighting (LED preferred)",
      "Spill kit available and stocked",
      "Forklift certifications current",
      "Forklift daily inspections performed",
      "Proper glove sizes available",
      "Clear path of travel maintained",
      "Material stored properly (no blocked doors)",
      "Oil containment adequate",
    ],
    violations: [
      "Insufficient glove sizes for employees",
      "Excess oil with limited containment",
      "Lighting replacement needed",
      "Doors blocked with material",
      "Excess storage blocking paths",
      "Path of travel not established",
      "Forklift certifications expired",
      "Sharp edges present on stored material",
      "Spill kit needs upgrade",
    ],
    whyItMatters:
      "Warehouse safety affects every worker who picks up materials. Proper storage, containment, and forklift safety prevent crush injuries, spills, and struck-by incidents.",
  },

  mechanical: {
    id: "mechanical",
    label: "Mechanical",
    icon: "wrench",
    color: "#0EA5E9", // sky-500
    description:
      "Mechanical equipment, material laydown, and equipment securing",
    keywords: [
      "mechanical",
      "material",
      "laydown",
      "red tag",
      "secured",
      "equipment",
    ],
    lookFor: [
      "Material laydown area organized",
      "Equipment properly secured and red-tagged when out of service",
      "Pre-rigging plan in place",
      "Dynamic testing performed (UP/DOWN)",
      "Job scope and site preparation complete",
    ],
    violations: [
      "Material laydown disorganized",
      "Equipment not secured or red-tagged",
      "Pre-rigging plan not observed in field",
      "Dynamic test UP/DOWN not tested",
      "MOD site preparation incomplete",
      "Job scope review not performed prior to job",
    ],
    whyItMatters:
      "Organized mechanical areas prevent struck-by and caught-in hazards. Pre-rigging plans and dynamic testing are mandatory safety controls that must be verified before work begins.",
  },

  jumpers: {
    id: "jumpers",
    label: "Jumpers",
    icon: "cable",
    color: "#DC2626", // red-600
    description: "Authorized jumper usage and electrical bypass procedures",
    keywords: ["jumper", "bypass", "unauthorized", "electrical", "wire"],
    lookFor: [
      "Only authorized jumpers used",
      "Jumper log maintained",
      "Proper jumper wire type and gauge",
      "Jumpers removed after use",
    ],
    violations: [
      "Use of unauthorized jumpers",
      "No jumper log maintained",
      "Improper jumper wire type",
      "Jumpers left in place after work completed",
    ],
    whyItMatters:
      "Unauthorized jumpers bypass critical safety circuits and can cause unexpected car movement, leading to fatal crush injuries. Only approved jumper procedures may be used.",
  },
};

// Helper functions
export function getCategoryById(id: CategoryId): CategoryDefinition {
  return SAFETY_CATEGORIES[id];
}

export function getCategoryLabel(id: string): string {
  return (SAFETY_CATEGORIES as Record<string, CategoryDefinition>)[id]?.label ?? id;
}

export function getCategoryColor(id: string): string {
  return (SAFETY_CATEGORIES as Record<string, CategoryDefinition>)[id]?.color ?? "#6B7280";
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
