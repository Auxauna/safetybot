// Mock data for demo/wireframe - no backend needed
// Data modeled after real Safety Blitz field assessments

// =====================================================
// TYPES
// =====================================================

export interface Site {
  _id: string;
  name: string;
  address: string;
  status: "active" | "inactive";
  contactName: string;
  contactPhone: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Finding {
  id: string;
  category: string;
  categoryLabel: string;
  severity: "critical" | "warning" | "compliant";
  title: string;
  description: string;
  recommendation: string | null;
  regulation: string;
  confidence: "high" | "medium" | "low";
  status: "pending" | "confirmed" | "rejected";
}

export interface Photo {
  _id: string;
  inspectionId: string;
  url: string;
  filename: string;
  analysisStatus: "pending" | "analyzing" | "complete" | "error";
  reviewStatus: "pending" | "confirmed" | "rejected";
  overallSeverity: "critical" | "warning" | "compliant" | "unclear";
  aiFindings: Finding[];
  uploadedAt: number;
}

export interface InspectionSummary {
  totalItems: number;
  passCount: number;
  failCount: number;
  warningCount: number;
  naCount: number;
  compliancePercent: number;
  criticalFailures: number;
  totalPhotos: number;
  criticalFindings: number;
  warningFindings: number;
  compliantPhotos: number;
}

export interface BlitzTeamMember {
  name: string;
  role: string;
}

export interface SafetyBlitz {
  _id: string;
  inspectionId: string;
  siteId: string;
  date: string;
  teamMembers: BlitzTeamMember[];
  fppesCompleted: number;
  overallScore: number;
  champions: string[];
  scorecard: { recordables: number; fiscalYear: string };
}

export interface Inspection {
  _id: string;
  siteId: string;
  siteName?: string;
  status: "uploading" | "analyzing" | "reviewing" | "completed";
  inspectorName: string;
  startedAt: number;
  completedAt?: number;
  photoCount: number;
  analyzedCount: number;
  summary?: InspectionSummary;
  notes?: string;
  blitz?: SafetyBlitz;
}

export interface SiteFinding {
  _id: string;
  inspectionId: string;
  siteId: string;
  siteName?: string;
  category: string;
  severity: "critical" | "warning";
  status: "open" | "assigned" | "resolved";
  title: string;
  description: string;
  location?: string;
  regulation: string;
  aiSuggested: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CorrectiveAction {
  _id: string;
  findingId: string;
  siteId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: number;
  dueDate: number;
  status: "pending" | "in_progress" | "completed";
  description: string;
}

// =====================================================
// DEMO PHOTOS - Elevator Safety Blitz field findings
// =====================================================

const DEMO_PHOTO_DATA = [
  {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    filename: "hoistway_screening.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "critical" as const,
        title: "Inadequate screening at hoistway opening",
        description:
          "Hoistway opening screening is insufficient. Opening secured only with zip ties instead of proper rigid screening material.",
        recommendation:
          "Install proper rigid screening at all hoistway openings. Daily confirmation required. Remove zip tie installations immediately.",
        regulation: "ASME A17.1 Section 2.1",
        confidence: "high" as const,
      },
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "warning" as const,
        title: "Exposed hole in hoistway",
        description:
          "Exposed opening in hoistway wall that presents a fall and dropped object hazard.",
        recommendation:
          "Cover or screen all openings in hoistway. Ensure dropped object prevention measures are in place.",
        regulation: "ASME A17.1 Section 2.1.1",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    filename: "loto_disconnect.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "loto",
        categoryLabel: "Lockout/Tagout",
        severity: "critical" as const,
        title: "Missing LOTO tags with required information",
        description:
          "LOTO tags are missing name, hazard description, and contact information. Tags must include all required identification.",
        recommendation:
          "Enforce FPP book requirements 100%. All tags must include worker name, hazard description, and contact information.",
        regulation: "29 CFR 1910.147(c)(5)",
        confidence: "high" as const,
      },
      {
        category: "loto",
        categoryLabel: "Lockout/Tagout",
        severity: "warning" as const,
        title: "Multiple employees using only one lock",
        description:
          "Observed multiple employees relying on a single lock for energy isolation instead of individual locks.",
        recommendation:
          "Each employee must apply their own personal lock on the disconnect. Use a hasp for group lockout situations.",
        regulation: "29 CFR 1910.147(c)(6)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800",
    filename: "fall_protection_harness.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "critical" as const,
        title: "Harness not fit properly",
        description:
          "Worker's fall arrest harness is not properly fitted. Straps are loose and not adjusted to body.",
        recommendation:
          "Immediately retrain worker on proper harness fitting. Harness must be snug with no twisted straps and properly adjusted.",
        regulation: "29 CFR 1926.502(d)",
        confidence: "high" as const,
      },
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "warning" as const,
        title: "No toe board at hoistway edge",
        description:
          "Toe board missing at hoistway level 2 opening, creating dropped object potential for workers below.",
        recommendation:
          "Install toe boards at all hoistway openings where work is performed above other workers.",
        regulation: "29 CFR 1926.502(j)",
        confidence: "medium" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=800",
    filename: "warehouse_storage.jpg",
    severity: "warning" as const,
    findings: [
      {
        category: "warehouse",
        categoryLabel: "Warehouse",
        severity: "warning" as const,
        title: "Excess oil in warehouse with limited containment",
        description:
          "Excess oil stored in warehouse area with limited containment available. Spill potential elevated.",
        recommendation:
          "Upgrade spill kit. Ensure adequate containment is available for all stored fluids. Evaluate excess storage.",
        regulation: "29 CFR 1910.106",
        confidence: "high" as const,
      },
      {
        category: "ppe",
        categoryLabel: "PPE Compliance",
        severity: "warning" as const,
        title: "Insufficient glove sizes for employees",
        description:
          "Not all glove sizes are available in the warehouse for workers to use. Some employees may be using improperly sized gloves.",
        recommendation:
          "Stock all standard glove sizes. Ensure every employee has access to properly fitted cut level 4 gloves.",
        regulation: "29 CFR 1926.95",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800",
    filename: "car_top_inspection.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "hoistway_access",
        categoryLabel: "Hoistway Access",
        severity: "compliant" as const,
        title: "Stop switch independently tested",
        description:
          "Stop switch was independently tested and verified operational before car top access. Good safety practice.",
        recommendation: null,
        regulation: "ASME A17.1 Section 2.26.1",
        confidence: "high" as const,
      },
      {
        category: "barricades",
        categoryLabel: "Barricades & Signage",
        severity: "compliant" as const,
        title: "Good barricade usage at hoistway",
        description:
          "Barricades properly installed at hoistway opening with adequate screening. Well-maintained safety perimeter.",
        recommendation: null,
        regulation: "ASME A17.1 Section 2.1",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    filename: "mechanical_laydown.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "mechanical",
        categoryLabel: "Mechanical",
        severity: "compliant" as const,
        title: "Material laydown organized",
        description:
          "Material laydown area is clean and well organized. Equipment properly sorted and accessible.",
        recommendation: null,
        regulation: "29 CFR 1926.25(a)",
        confidence: "high" as const,
      },
      {
        category: "mechanical",
        categoryLabel: "Mechanical",
        severity: "compliant" as const,
        title: "Equipment secured and red-tagged",
        description:
          "Out-of-service equipment properly secured and red-tagged. Clear identification of equipment status.",
        recommendation: null,
        regulation: "29 CFR 1910.147",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800",
    filename: "ppe_electrical_work.jpg",
    severity: "warning" as const,
    findings: [
      {
        category: "ppe",
        categoryLabel: "PPE Compliance",
        severity: "warning" as const,
        title: "Arc rated gloves and sleeves not being used",
        description:
          "Worker performing electrical work observed without arc rated gloves and sleeves. PPE not being used during audits.",
        recommendation:
          "Ensure PPE program is applied 100% of the time. Zero tolerance for missing arc rated gloves and sleeves during electrical work.",
        regulation: "29 CFR 1910.269(l)(6)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    filename: "rigging_operation.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "hoisting_rigging",
        categoryLabel: "Hoisting & Rigging",
        severity: "critical" as const,
        title: "No hoisting/rigging plan in place",
        description:
          "Rigging operation observed with no formal hoisting/rigging plan. No gloves worn during rigging. Rigging on sharp edge without softener.",
        recommendation:
          "Stop work. Develop and review rigging plan before resuming. Provide softeners for all sharp edges. Gloves required at all times.",
        regulation: "29 CFR 1926.251",
        confidence: "high" as const,
      },
    ],
  },
];

// =====================================================
// DEMO DATA
// =====================================================

// Demo Sites - Elevator branch locations
export const DEMO_SITES: Site[] = [
  {
    _id: "site_1",
    name: "Denver Metro Branch",
    address: "2500 Blake Street, Denver, CO 80205",
    status: "active",
    contactName: "Doug Thompson",
    contactPhone: "(303) 555-0134",
    notes:
      "Full-service branch. NI, Service, and Modernization operations active.",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: "site_2",
    name: "Salt Lake City Branch",
    address: "150 S State Street, Salt Lake City, UT 84111",
    status: "active",
    contactName: "Jeremy Robinson",
    contactPhone: "(801) 555-0278",
    notes:
      "Full-service branch. NI, Service, Modernization, and Repair operations.",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: "site_3",
    name: "Phoenix Valley Branch",
    address: "401 E Jefferson Street, Phoenix, AZ 85004",
    status: "active",
    contactName: "Mark Sullivan",
    contactPhone: "(480) 555-0192",
    notes: "Service and Modernization branch. Warehouse operations on-site.",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
];

// Generate photos with findings for an inspection
function generatePhotos(
  inspectionId: string,
  isReviewing: boolean = false
): Photo[] {
  return DEMO_PHOTO_DATA.map((demoPhoto, index) => {
    const isReviewed = isReviewing ? index < 3 : true;

    return {
      _id: `photo_${inspectionId}_${index}`,
      inspectionId,
      url: demoPhoto.url,
      filename: demoPhoto.filename,
      analysisStatus: "complete" as const,
      reviewStatus: isReviewed ? "confirmed" : "pending",
      overallSeverity: demoPhoto.severity,
      aiFindings: demoPhoto.findings.map((f, fIdx) => ({
        id: `finding_${inspectionId}_${index}_${fIdx}`,
        ...f,
        status: isReviewed ? ("confirmed" as const) : ("pending" as const),
      })),
      uploadedAt: Date.now() - 2 * 60 * 60 * 1000,
    };
  });
}

// Demo Safety Blitz Data
const DEMO_BLITZ_DENVER: SafetyBlitz = {
  _id: "blitz_denver",
  inspectionId: "inspection_completed",
  siteId: "site_1",
  date: "2025-03-17",
  teamMembers: [
    { name: "Lee Blevins", role: "AVP" },
    { name: "Doug Thompson", role: "Safety Manager" },
    { name: "Pat Stauner", role: "AOD NI" },
    { name: "Erik Richardson", role: "AOD Mod" },
    { name: "Frank Luevano", role: "Superintendent" },
    { name: "Adam Koester", role: "NI Superintendent" },
    { name: "AJ Drago", role: "NI Ops Manager" },
    { name: "Corey Klusack", role: "Service Superintendent" },
  ],
  fppesCompleted: 14,
  overallScore: 55,
  champions: ["Jeremiah Barnes"],
  scorecard: { recordables: 0, fiscalYear: "FY25" },
};

const DEMO_BLITZ_SLC: SafetyBlitz = {
  _id: "blitz_slc",
  inspectionId: "inspection_reviewing",
  siteId: "site_2",
  date: "2025-05-06",
  teamMembers: [
    { name: "Lee Blevins", role: "AVP" },
    { name: "Doug Thompson", role: "Safety Manager" },
    { name: "Pat Stauner", role: "AOD NI" },
    { name: "Erik Richardson", role: "AOD Mod" },
    { name: "Jeremy Robinson", role: "General Manager" },
    { name: "Bryan Treseder", role: "NI Superintendent" },
    { name: "Jared Forebush", role: "NI/MOD Superintendent" },
    { name: "Kevin Vrotney", role: "SR/RP Superintendent" },
    { name: "Taylor Miller", role: "SR/RP Superintendent" },
  ],
  fppesCompleted: 28,
  overallScore: 78,
  champions: [
    "Luis Hernandez-Garcia",
    "Wayne Hovey",
    "Benjamin Adams",
    "Bryce Nielsen",
  ],
  scorecard: { recordables: 0, fiscalYear: "FY25" },
};

// Demo Inspections
export const DEMO_INSPECTIONS: Inspection[] = [
  {
    _id: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    status: "completed",
    inspectorName: "Doug Thompson",
    startedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000,
    photoCount: 8,
    analyzedCount: 8,
    summary: {
      totalItems: 0,
      passCount: 0,
      failCount: 0,
      warningCount: 0,
      naCount: 0,
      compliancePercent: 55,
      criticalFailures: 4,
      totalPhotos: 8,
      criticalFindings: 4,
      warningFindings: 5,
      compliantPhotos: 4,
    },
    notes:
      "Safety Blitz assessment. Snapshot evaluation, not a comprehensive review. Purpose is to provide an independent assessment to help ensure FPPe accuracy and ultimately reduce risk.",
    blitz: DEMO_BLITZ_DENVER,
  },
  {
    _id: "inspection_reviewing",
    siteId: "site_2",
    siteName: "Salt Lake City Branch",
    status: "reviewing",
    inspectorName: "Doug Thompson",
    startedAt: Date.now() - 3600000,
    photoCount: 8,
    analyzedCount: 8,
    blitz: DEMO_BLITZ_SLC,
  },
];

// Demo Photos by Inspection
export const DEMO_PHOTOS_BY_INSPECTION: Record<string, Photo[]> = {
  inspection_completed: generatePhotos("inspection_completed", false),
  inspection_reviewing: generatePhotos("inspection_reviewing", true),
};

// Demo Site Findings - matching Safety Blitz field observations
export const DEMO_SITE_FINDINGS: SiteFinding[] = [
  {
    _id: "siteFinding_1",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "fall_protection",
    severity: "critical",
    status: "assigned",
    title: "Inadequate screening at hoistway opening",
    description:
      "Hoistway opening screening is insufficient. Screening secured with zip ties instead of proper rigid material. Immediate correction required.",
    location: "Building A, 3rd floor hoistway",
    regulation: "ASME A17.1 Section 2.1",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_2",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "loto",
    severity: "critical",
    status: "open",
    title: "Missing LOTO tags with required information",
    description:
      "LOTO tags are missing name, hazard description, and contact information. Tags must include all required fields per FPP requirements.",
    location: "Building A, machine room disconnect",
    regulation: "29 CFR 1910.147(c)(5)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_3",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "fall_protection",
    severity: "critical",
    status: "assigned",
    title: "Harness not fit properly",
    description:
      "Worker's fall arrest harness was not properly fitted. Straps loose, not adjusted to body. Immediate retraining required.",
    location: "Building B, car top",
    regulation: "29 CFR 1926.502(d)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_4",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "ppe",
    severity: "warning",
    status: "open",
    title: "Arc rated gloves and sleeves not being used",
    description:
      "Workers not consistently using arc rated gloves and sleeves during electrical work. PPE program not applied 100% of the time.",
    location: "Building A, controller room",
    regulation: "29 CFR 1910.269(l)(6)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_5",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "warehouse",
    severity: "warning",
    status: "open",
    title: "Excess oil in warehouse with limited containment",
    description:
      "Excess oil stored with limited containment available. Spill kit needs upgrade. Evaluate excess storage levels.",
    location: "Warehouse, storage area",
    regulation: "29 CFR 1910.106",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_6",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "hoisting_rigging",
    severity: "critical",
    status: "open",
    title: "No hoisting/rigging plan in place",
    description:
      "Rigging operation observed without a formal hoisting/rigging plan. No gloves worn. Rigging on sharp edge without softener. Citations issued.",
    location: "Building A, hoistway",
    regulation: "29 CFR 1926.251",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_7",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "hoistway_access",
    severity: "warning",
    status: "assigned",
    title: "Stop switch verification not performed",
    description:
      "Stop switch was not independently verified before hoistway access. Workers must test stop switch every time before entry.",
    location: "Building B, 5th floor",
    regulation: "ASME A17.1 Section 2.26.1",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_8",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Denver Metro Branch",
    category: "loto",
    severity: "critical",
    status: "open",
    title: "Multiple employees using only one lock",
    description:
      "Multiple employees observed relying on a single lock for energy isolation. Each worker must apply their own personal lock.",
    location: "Building A, 2nd floor disconnect",
    regulation: "29 CFR 1910.147(c)(6)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

// Demo Corrective Actions - Road to Zero style
export const DEMO_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    _id: "action_1",
    findingId: "siteFinding_1",
    siteId: "site_1",
    assignedTo: "Frank Luevano",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
    status: "in_progress",
    description:
      "Install proper barricades and screening at all hoistway openings. Daily confirmation required. Remove zip tie installations immediately.",
  },
  {
    _id: "action_2",
    findingId: "siteFinding_2",
    siteId: "site_1",
    assignedTo: "Adam Koester",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: "pending",
    description:
      "Employee retraining on LOTO procedures. Conduct audits to verify compliance. Enforce FPP book requirements 100%.",
  },
  {
    _id: "action_3",
    findingId: "siteFinding_3",
    siteId: "site_1",
    assignedTo: "AJ Drago",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
    status: "in_progress",
    description:
      "Immediate retraining on proper harness fitting. All harnesses to be inspected and properly adjusted before next shift.",
  },
  {
    _id: "action_4",
    findingId: "siteFinding_4",
    siteId: "site_1",
    assignedTo: "Corey Klusack",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    status: "pending",
    description:
      "Enforce PPE policy: arc rated gloves and sleeves required 100% of the time during electrical work. Zero tolerance.",
  },
  {
    _id: "action_5",
    findingId: "siteFinding_6",
    siteId: "site_1",
    assignedTo: "Frank Luevano",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: "pending",
    description:
      "Conduct rigging plan training for all field crews. Ensure softeners are available and used on all sharp edges.",
  },
  {
    _id: "action_6",
    findingId: "siteFinding_7",
    siteId: "site_1",
    assignedTo: "Adam Koester",
    assignedBy: "Doug Thompson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: "pending",
    description:
      "Retrain all personnel on stop switch verification protocol. Conduct field audits to verify compliance.",
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Dashboard Stats
export function getDashboardStats() {
  return {
    openFindings: DEMO_SITE_FINDINGS.filter((f) => f.status !== "resolved")
      .length,
    criticalFindings: DEMO_SITE_FINDINGS.filter(
      (f) => f.severity === "critical" && f.status !== "resolved"
    ).length,
    dueThisWeek: DEMO_CORRECTIVE_ACTIONS.filter(
      (a) => a.status !== "completed"
    ).length,
    overdueActions: 0,
  };
}

// Get all sites
export function getSites(status?: "active" | "inactive") {
  if (status) {
    return DEMO_SITES.filter((s) => s.status === status);
  }
  return DEMO_SITES;
}

// Get site by ID
export function getSiteById(id: string): Site | undefined {
  return DEMO_SITES.find((s) => s._id === id);
}

// Get recent inspections
export function getRecentInspections(limit?: number) {
  const sorted = [...DEMO_INSPECTIONS].sort(
    (a, b) => b.startedAt - a.startedAt
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get inspection by ID
export function getInspectionById(id: string): Inspection | undefined {
  return DEMO_INSPECTIONS.find((i) => i._id === id);
}

// Get inspection with site name
export function getInspectionWithSite(
  inspectionId: string
): (Inspection & { siteName: string }) | null {
  const inspection = getInspectionById(inspectionId);
  if (!inspection) return null;

  const site = getSiteById(inspection.siteId);
  return {
    ...inspection,
    siteName: site?.name || "Unknown Site",
  };
}

// Get photos for inspection
export function getPhotosForInspection(inspectionId: string): Photo[] {
  return DEMO_PHOTOS_BY_INSPECTION[inspectionId] || [];
}

// Get photo stats for inspection
export function getPhotoStats(inspectionId: string) {
  const photos = getPhotosForInspection(inspectionId);

  const stats = {
    total: photos.length,
    pending: photos.filter((p) => p.analysisStatus === "pending").length,
    analyzing: photos.filter((p) => p.analysisStatus === "analyzing").length,
    complete: photos.filter((p) => p.analysisStatus === "complete").length,
    error: photos.filter((p) => p.analysisStatus === "error").length,
    critical: photos.filter((p) => p.overallSeverity === "critical").length,
    warning: photos.filter((p) => p.overallSeverity === "warning").length,
    compliant: photos.filter((p) => p.overallSeverity === "compliant").length,
    unclear: photos.filter((p) => p.overallSeverity === "unclear").length,
    needsReview: photos.filter(
      (p) => p.reviewStatus === "pending" && p.analysisStatus === "complete"
    ).length,
    reviewed: photos.filter(
      (p) => p.reviewStatus === "confirmed" || p.reviewStatus === "rejected"
    ).length,
  };

  let totalFindings = 0;
  let confirmedFindings = 0;
  let criticalFindings = 0;
  let warningFindings = 0;

  for (const photo of photos) {
    for (const finding of photo.aiFindings) {
      totalFindings++;
      if (finding.status === "confirmed") {
        confirmedFindings++;
        if (finding.severity === "critical") criticalFindings++;
        if (finding.severity === "warning") warningFindings++;
      }
    }
  }

  return {
    ...stats,
    totalFindings,
    confirmedFindings,
    criticalFindings,
    warningFindings,
  };
}

// Get blitz data for an inspection
export function getBlitzForInspection(
  inspectionId: string
): SafetyBlitz | undefined {
  const inspection = getInspectionById(inspectionId);
  return inspection?.blitz;
}

// Get site findings
export function getSiteFindings(filters?: {
  status?: string;
  siteId?: string;
}) {
  let findings = [...DEMO_SITE_FINDINGS];

  if (filters?.status) {
    findings = findings.filter((f) => f.status === filters.status);
  }
  if (filters?.siteId) {
    findings = findings.filter((f) => f.siteId === filters.siteId);
  }

  return findings;
}

// Get corrective actions
export function getCorrectiveActions(filters?: {
  status?: string;
  siteId?: string;
}) {
  let actions = [...DEMO_CORRECTIVE_ACTIONS];

  if (filters?.status) {
    actions = actions.filter((a) => a.status === filters.status);
  }
  if (filters?.siteId) {
    actions = actions.filter((a) => a.siteId === filters.siteId);
  }

  return actions;
}

// =====================================================
// LEGACY SUPPORT (for existing pages)
// =====================================================

import {
  ChecklistResult,
  ChecklistCategory,
  ELEVATOR_CHECKLIST,
} from "./checklist";

export interface LegacyPhoto {
  id: string;
  filename: string;
  url: string;
  timestamp: string;
}

export interface Visit {
  id: string;
  name: string;
  location?: string;
  date: string;
  status: "uploading" | "analyzing" | "ready" | "reviewed";
  photoCount: number;
  checklistResults?: ChecklistResult[];
}

// Sample construction photos
const SAMPLE_PHOTOS: LegacyPhoto[] = [
  {
    id: "p1",
    filename: "IMG_0234.jpg",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    timestamp: "09:23 AM",
  },
  {
    id: "p2",
    filename: "IMG_0235.jpg",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
    timestamp: "09:25 AM",
  },
  {
    id: "p3",
    filename: "IMG_0236.jpg",
    url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
    timestamp: "09:31 AM",
  },
  {
    id: "p4",
    filename: "IMG_0237.jpg",
    url: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=400&h=300&fit=crop",
    timestamp: "09:45 AM",
  },
  {
    id: "p5",
    filename: "IMG_0238.jpg",
    url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop",
    timestamp: "10:02 AM",
  },
  {
    id: "p6",
    filename: "IMG_0239.jpg",
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
    timestamp: "10:15 AM",
  },
  {
    id: "p7",
    filename: "IMG_0240.jpg",
    url: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=400&h=300&fit=crop",
    timestamp: "10:22 AM",
  },
  {
    id: "p8",
    filename: "IMG_0241.jpg",
    url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=300&fit=crop",
    timestamp: "10:38 AM",
  },
];

export const MOCK_CHECKLIST_RESULTS: ChecklistResult[] =
  ELEVATOR_CHECKLIST.map((item) => {
    const results: Record<string, Partial<ChecklistResult>> = {
      "mr-01": {
        status: "pass",
        photoIds: ["p1"],
        notes: "Door observed self-closing properly",
      },
      "mr-02": {
        status: "pass",
        photoIds: ["p1", "p2"],
        notes: "Lighting appears adequate",
      },
      "mr-03": {
        status: "warning",
        photoIds: ["p2"],
        notes: "Minor debris observed near controller",
      },
      "mr-04": {
        status: "pass",
        photoIds: [],
        notes: "Temperature gauge visible showing 72 F",
      },
      "mr-05": {
        status: "pass",
        photoIds: ["p1"],
        notes: "Fire extinguisher visible with current tag",
      },
      "mr-06": {
        status: "fail",
        photoIds: ["p2"],
        notes: "Di-electric mat not visible at controller station",
      },
      "mr-07": {
        status: "pass",
        photoIds: ["p1"],
        notes: "Smoke detector visible on ceiling",
      },
      "mr-08": {
        status: "pass",
        photoIds: ["p2"],
        notes: "Clearances appear maintained",
      },
      "ct-01": {
        status: "pass",
        photoIds: ["p3"],
        notes: "Stop switch observed and tested",
      },
      "ct-02": {
        status: "pass",
        photoIds: ["p3"],
        notes: "TCOD in operating position",
      },
      "ct-03": {
        status: "warning",
        photoIds: ["p3"],
        notes: "Guardrail chain partially loose",
      },
      "ct-04": {
        status: "pass",
        photoIds: ["p3", "p4"],
        notes: "Adequate lighting observed",
      },
      "ct-05": {
        status: "pass",
        photoIds: ["p4"],
        notes: "Ropes appear in good condition",
      },
      "ct-06": {
        status: "pass",
        photoIds: ["p4"],
        notes: "Clearance verified",
      },
      "pt-01": {
        status: "pass",
        photoIds: ["p5"],
        notes: "Pit stop switch accessible",
      },
      "pt-02": {
        status: "pass",
        photoIds: ["p5"],
        notes: "Lighting adequate",
      },
      "pt-03": {
        status: "pass",
        photoIds: ["p5"],
        notes: "Ladder in good condition",
      },
      "pt-04": {
        status: "pass",
        photoIds: ["p5"],
        notes: "GFCI outlet present",
      },
      "pt-05": {
        status: "warning",
        photoIds: ["p5"],
        notes: "Minor water staining observed on pit floor",
      },
      "pt-06": {
        status: "pass",
        photoIds: ["p5"],
        notes: "Buffers appear serviceable",
      },
      "pt-07": {
        status: "pass",
        photoIds: ["p5"],
        notes: "Clearance adequate",
      },
      "sd-01": {
        status: "pass",
        photoIds: ["p4"],
        notes: "Governor in good condition",
      },
      "sd-02": {
        status: "pass",
        photoIds: ["p6"],
        notes: "Door restrictor functional",
      },
      "sd-03": {
        status: "pass",
        photoIds: ["p6"],
        notes: "Door sensor responsive",
      },
      "sd-04": {
        status: "pass",
        photoIds: ["p3", "p5"],
        notes: "E-stops tested",
      },
      "ci-01": {
        status: "pass",
        photoIds: ["p6"],
        notes: "Emergency phone tested - connects to monitoring",
      },
      "ci-02": {
        status: "pass",
        photoIds: ["p6"],
        notes: "All buttons functional",
      },
      "ci-03": {
        status: "pass",
        photoIds: ["p6"],
        notes: "Car lighting adequate",
      },
      "ci-04": {
        status: "pass",
        photoIds: ["p6"],
        notes: "Door force acceptable",
      },
      "lo-01": {
        status: "fail",
        photoIds: ["p7"],
        notes:
          "Work observed on controller without personal lock on disconnect",
      },
      "lo-02": {
        status: "fail",
        photoIds: ["p7"],
        notes: "No tag visible on disconnect",
      },
      "lo-03": {
        status: "not_inspected",
        photoIds: [],
        notes: "Unable to verify - LOTO not properly applied",
      },
      "pp-01": {
        status: "pass",
        photoIds: ["p3", "p4", "p8"],
        notes: "All personnel wearing hard hats",
      },
      "pp-02": {
        status: "pass",
        photoIds: ["p3", "p8"],
        notes: "Safety glasses observed",
      },
      "pp-03": {
        status: "fail",
        photoIds: ["p3"],
        notes: "Worker on car top without visible tie-off",
      },
      "pp-04": {
        status: "pass",
        photoIds: ["p8"],
        notes: "Appropriate footwear observed",
      },
    };

    const result = results[item.id] || {
      status: "not_inspected",
      photoIds: [],
    };

    return {
      ...item,
      status: result.status || "not_inspected",
      photoIds: result.photoIds || [],
      notes: result.notes,
      aiConfidence:
        result.photoIds && result.photoIds.length > 0 ? "high" : "low",
    };
  });

export const MOCK_PHOTOS = SAMPLE_PHOTOS;

export const MOCK_VISITS: Visit[] = [
  {
    id: "visit-1",
    name: "Denver Metro Branch",
    location: "Denver, CO",
    date: "2026-01-30",
    status: "ready",
    photoCount: 47,
    checklistResults: MOCK_CHECKLIST_RESULTS,
  },
  {
    id: "visit-2",
    name: "Salt Lake City Branch",
    location: "Salt Lake City, UT",
    date: "2026-01-28",
    status: "analyzing",
    photoCount: 32,
  },
  {
    id: "visit-3",
    name: "Phoenix Valley Branch",
    location: "Phoenix, AZ",
    date: "2026-01-25",
    status: "ready",
    photoCount: 28,
    checklistResults: MOCK_CHECKLIST_RESULTS.map((r) => ({
      ...r,
      status: r.criticalSafety ? "pass" : r.status,
    })),
  },
];

// Legacy Helpers
export function getVisitById(id: string): Visit | undefined {
  return MOCK_VISITS.find((v) => v.id === id);
}

export function getPhotoById(id: string): LegacyPhoto | undefined {
  return MOCK_PHOTOS.find((p) => p.id === id);
}

export function getPhotosByIds(ids: string[]): LegacyPhoto[] {
  return ids
    .map((id) => MOCK_PHOTOS.find((p) => p.id === id))
    .filter(Boolean) as LegacyPhoto[];
}

export function getChecklistSummary(results: ChecklistResult[]) {
  const total = results.length;
  const pass = results.filter((r) => r.status === "pass").length;
  const fail = results.filter((r) => r.status === "fail").length;
  const warning = results.filter((r) => r.status === "warning").length;
  const notInspected = results.filter(
    (r) => r.status === "not_inspected"
  ).length;
  const criticalFails = results.filter(
    (r) => r.status === "fail" && r.criticalSafety
  ).length;

  return {
    total,
    pass,
    fail,
    warning,
    notInspected,
    criticalFails,
    complianceRate:
      total > 0 ? Math.round((pass / (total - notInspected)) * 100) : 0,
  };
}

export function getResultsByCategory(
  results: ChecklistResult[],
  category: ChecklistCategory
) {
  return results.filter((r) => r.category === category);
}
