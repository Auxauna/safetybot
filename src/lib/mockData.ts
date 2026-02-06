// Mock data for demo/wireframe - no backend needed
// This replaces Convex with client-side demo data

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
// DEMO PHOTOS - Sample construction safety images
// =====================================================

const DEMO_PHOTO_DATA = [
  {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    filename: "scaffold_workers.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "critical" as const,
        title: "Worker at height without fall arrest system",
        description: "Worker visible on scaffold platform approximately 15 feet above ground level. No fall arrest harness or lanyard visible.",
        recommendation: "Stop work immediately. All workers at heights above 6 feet must wear properly fitted fall arrest harnesses.",
        regulation: "29 CFR 1926.501(b)(1)",
        confidence: "high" as const,
      },
      {
        category: "scaffolding",
        categoryLabel: "Scaffolding",
        severity: "warning" as const,
        title: "Missing mid-rail on scaffold guardrail",
        description: "Scaffold platform has top rail but mid-rail appears to be missing.",
        recommendation: "Install mid-rail at approximately 21 inches above the platform level.",
        regulation: "29 CFR 1926.451(g)(4)",
        confidence: "medium" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    filename: "electrical_panel.jpg",
    severity: "warning" as const,
    findings: [
      {
        category: "electrical",
        categoryLabel: "Electrical Safety",
        severity: "warning" as const,
        title: "Electrical panel cover partially open",
        description: "Main electrical panel door is not fully closed. Internal components partially visible.",
        recommendation: "Close and secure panel cover. Verify arc flash labels are posted.",
        regulation: "29 CFR 1926.405(b)(1)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=800",
    filename: "construction_site.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "housekeeping",
        categoryLabel: "Housekeeping",
        severity: "compliant" as const,
        title: "Work area well organized",
        description: "Construction area shows good housekeeping practices. Materials properly stacked, walkways clear.",
        recommendation: null,
        regulation: "29 CFR 1926.25(a)",
        confidence: "high" as const,
      },
      {
        category: "ppe",
        categoryLabel: "PPE Compliance",
        severity: "compliant" as const,
        title: "Workers wearing proper PPE",
        description: "Visible workers are wearing hard hats, high-visibility vests, and appropriate footwear.",
        recommendation: null,
        regulation: "29 CFR 1926.100(a)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800",
    filename: "ladder_work.jpg",
    severity: "critical" as const,
    findings: [
      {
        category: "ladders",
        categoryLabel: "Ladders",
        severity: "critical" as const,
        title: "Ladder not secured at top",
        description: "Extension ladder is not secured at the top and does not extend 3 feet above the landing surface.",
        recommendation: "Secure ladder at top. Ensure ladder extends at least 3 feet above landing.",
        regulation: "29 CFR 1926.1053(b)(1)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800",
    filename: "worker_harness.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "fall_protection",
        categoryLabel: "Fall Protection",
        severity: "compliant" as const,
        title: "Fall arrest system properly worn",
        description: "Worker at elevated position is wearing full body harness with shock-absorbing lanyard connected to anchor point.",
        recommendation: null,
        regulation: "29 CFR 1926.502(d)",
        confidence: "high" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    filename: "excavation.jpg",
    severity: "warning" as const,
    findings: [
      {
        category: "excavation",
        categoryLabel: "Excavation",
        severity: "warning" as const,
        title: "Spoil pile too close to excavation edge",
        description: "Excavated material appears to be piled within 2 feet of the excavation edge.",
        recommendation: "Move spoil pile at least 2 feet from the edge of the excavation.",
        regulation: "29 CFR 1926.651(j)(2)",
        confidence: "medium" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800",
    filename: "crane_operation.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "cranes_rigging",
        categoryLabel: "Cranes & Rigging",
        severity: "compliant" as const,
        title: "Crane operating within safe parameters",
        description: "Mobile crane set up on stable ground with outriggers deployed. Load line appears vertical.",
        recommendation: null,
        regulation: "29 CFR 1926.1417",
        confidence: "medium" as const,
      },
    ],
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    filename: "building_exterior.jpg",
    severity: "compliant" as const,
    findings: [
      {
        category: "housekeeping",
        categoryLabel: "Housekeeping",
        severity: "compliant" as const,
        title: "Site perimeter properly secured",
        description: "Construction site perimeter fencing is intact. Warning signage visible at entry points.",
        recommendation: null,
        regulation: "29 CFR 1926.600(a)(1)",
        confidence: "high" as const,
      },
    ],
  },
];

// =====================================================
// DEMO DATA
// =====================================================

// Demo Sites
export const DEMO_SITES: Site[] = [
  {
    _id: "site_1",
    name: "Downtown Tower Project",
    address: "500 Main Street, San Francisco, CA 94105",
    status: "active",
    contactName: "Mike Rodriguez",
    contactPhone: "(415) 555-0123",
    notes: "42-story mixed-use development. Phase 2 steel erection in progress.",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: "site_2",
    name: "Harbor View Condos",
    address: "1200 Waterfront Drive, Oakland, CA 94607",
    status: "active",
    contactName: "Sarah Chen",
    contactPhone: "(510) 555-0456",
    notes: "Residential development, 8 buildings. Foundation work complete.",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: "site_3",
    name: "Metro Transit Hub",
    address: "100 Main Street, Denver, CO 80202",
    status: "active",
    contactName: "Tom Rodriguez",
    contactPhone: "(303) 555-0167",
    notes: "Transit station renovation. Night shift work 10PM-6AM.",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
];

// Generate photos with findings for an inspection
function generatePhotos(inspectionId: string, isReviewing: boolean = false): Photo[] {
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

// Demo Inspections
export const DEMO_INSPECTIONS: Inspection[] = [
  {
    _id: "inspection_completed",
    siteId: "site_1",
    siteName: "Downtown Tower Project",
    status: "completed",
    inspectorName: "James Wilson",
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
      compliancePercent: 62,
      criticalFailures: 2,
      totalPhotos: 8,
      criticalFindings: 2,
      warningFindings: 3,
      compliantPhotos: 5,
    },
    notes: "Weekly safety inspection. Two critical fall protection issues identified. Work stopped pending corrective actions.",
  },
  {
    _id: "inspection_reviewing",
    siteId: "site_2",
    siteName: "Harbor View Condos",
    status: "reviewing",
    inspectorName: "Demo User",
    startedAt: Date.now() - 3600000,
    photoCount: 8,
    analyzedCount: 8,
  },
];

// Demo Photos by Inspection
export const DEMO_PHOTOS_BY_INSPECTION: Record<string, Photo[]> = {
  inspection_completed: generatePhotos("inspection_completed", false),
  inspection_reviewing: generatePhotos("inspection_reviewing", true),
};

// Demo Site Findings
export const DEMO_SITE_FINDINGS: SiteFinding[] = [
  {
    _id: "siteFinding_1",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Downtown Tower Project",
    category: "fall_protection",
    severity: "critical",
    status: "assigned",
    title: "Worker at height without fall arrest system",
    description: "Worker visible on scaffold platform approximately 15 feet above ground level without fall protection.",
    location: "Floor 18, East wing scaffold",
    regulation: "29 CFR 1926.501(b)(1)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_2",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Downtown Tower Project",
    category: "ladders",
    severity: "critical",
    status: "open",
    title: "Ladder not secured at top",
    description: "Extension ladder is not secured at the top and does not extend 3 feet above the landing surface.",
    location: "Floor 20, access point",
    regulation: "29 CFR 1926.1053(b)(1)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "siteFinding_3",
    inspectionId: "inspection_completed",
    siteId: "site_1",
    siteName: "Downtown Tower Project",
    category: "electrical",
    severity: "warning",
    status: "open",
    title: "Electrical panel cover partially open",
    description: "Main electrical panel door is not fully closed and latched.",
    location: "Floor 15, mechanical room",
    regulation: "29 CFR 1926.405(b)(1)",
    aiSuggested: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

// Demo Corrective Actions
export const DEMO_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    _id: "action_1",
    findingId: "siteFinding_1",
    siteId: "site_1",
    assignedTo: "Tom Martinez",
    assignedBy: "James Wilson",
    assignedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
    status: "in_progress",
    description: "Provide fall arrest harnesses to all workers on scaffold. Conduct safety briefing.",
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Dashboard Stats
export function getDashboardStats() {
  return {
    openFindings: DEMO_SITE_FINDINGS.filter(f => f.status !== "resolved").length,
    criticalFindings: DEMO_SITE_FINDINGS.filter(f => f.severity === "critical" && f.status !== "resolved").length,
    dueThisWeek: DEMO_CORRECTIVE_ACTIONS.filter(a => a.status !== "completed").length,
    overdueActions: 0,
  };
}

// Get all sites
export function getSites(status?: "active" | "inactive") {
  if (status) {
    return DEMO_SITES.filter(s => s.status === status);
  }
  return DEMO_SITES;
}

// Get site by ID
export function getSiteById(id: string): Site | undefined {
  return DEMO_SITES.find(s => s._id === id);
}

// Get recent inspections
export function getRecentInspections(limit?: number) {
  const sorted = [...DEMO_INSPECTIONS].sort((a, b) => b.startedAt - a.startedAt);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get inspection by ID
export function getInspectionById(id: string): Inspection | undefined {
  return DEMO_INSPECTIONS.find(i => i._id === id);
}

// Get inspection with site name
export function getInspectionWithSite(inspectionId: string): (Inspection & { siteName: string }) | null {
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
    pending: photos.filter(p => p.analysisStatus === "pending").length,
    analyzing: photos.filter(p => p.analysisStatus === "analyzing").length,
    complete: photos.filter(p => p.analysisStatus === "complete").length,
    error: photos.filter(p => p.analysisStatus === "error").length,
    critical: photos.filter(p => p.overallSeverity === "critical").length,
    warning: photos.filter(p => p.overallSeverity === "warning").length,
    compliant: photos.filter(p => p.overallSeverity === "compliant").length,
    unclear: photos.filter(p => p.overallSeverity === "unclear").length,
    needsReview: photos.filter(p => p.reviewStatus === "pending" && p.analysisStatus === "complete").length,
    reviewed: photos.filter(p => p.reviewStatus === "confirmed" || p.reviewStatus === "rejected").length,
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

// Get site findings
export function getSiteFindings(filters?: { status?: string; siteId?: string }) {
  let findings = [...DEMO_SITE_FINDINGS];

  if (filters?.status) {
    findings = findings.filter(f => f.status === filters.status);
  }
  if (filters?.siteId) {
    findings = findings.filter(f => f.siteId === filters.siteId);
  }

  return findings;
}

// Get corrective actions
export function getCorrectiveActions(filters?: { status?: string; siteId?: string }) {
  let actions = [...DEMO_CORRECTIVE_ACTIONS];

  if (filters?.status) {
    actions = actions.filter(a => a.status === filters.status);
  }
  if (filters?.siteId) {
    actions = actions.filter(a => a.siteId === filters.siteId);
  }

  return actions;
}

// =====================================================
// LEGACY SUPPORT (for existing pages)
// =====================================================

import { ChecklistResult, ChecklistCategory, ELEVATOR_CHECKLIST } from "./checklist";

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
  { id: "p1", filename: "IMG_0234.jpg", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", timestamp: "09:23 AM" },
  { id: "p2", filename: "IMG_0235.jpg", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop", timestamp: "09:25 AM" },
  { id: "p3", filename: "IMG_0236.jpg", url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop", timestamp: "09:31 AM" },
  { id: "p4", filename: "IMG_0237.jpg", url: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=400&h=300&fit=crop", timestamp: "09:45 AM" },
  { id: "p5", filename: "IMG_0238.jpg", url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop", timestamp: "10:02 AM" },
  { id: "p6", filename: "IMG_0239.jpg", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop", timestamp: "10:15 AM" },
  { id: "p7", filename: "IMG_0240.jpg", url: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=400&h=300&fit=crop", timestamp: "10:22 AM" },
  { id: "p8", filename: "IMG_0241.jpg", url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=300&fit=crop", timestamp: "10:38 AM" },
];

export const MOCK_CHECKLIST_RESULTS: ChecklistResult[] = ELEVATOR_CHECKLIST.map((item) => {
  const results: Record<string, Partial<ChecklistResult>> = {
    "mr-01": { status: "pass", photoIds: ["p1"], notes: "Door observed self-closing properly" },
    "mr-02": { status: "pass", photoIds: ["p1", "p2"], notes: "Lighting appears adequate" },
    "mr-03": { status: "warning", photoIds: ["p2"], notes: "Minor debris observed near controller" },
    "mr-04": { status: "pass", photoIds: [], notes: "Temperature gauge visible showing 72°F" },
    "mr-05": { status: "pass", photoIds: ["p1"], notes: "Fire extinguisher visible with current tag" },
    "mr-06": { status: "fail", photoIds: ["p2"], notes: "Di-electric mat not visible at controller station" },
    "mr-07": { status: "pass", photoIds: ["p1"], notes: "Smoke detector visible on ceiling" },
    "mr-08": { status: "pass", photoIds: ["p2"], notes: "Clearances appear maintained" },
    "ct-01": { status: "pass", photoIds: ["p3"], notes: "Stop switch observed and tested" },
    "ct-02": { status: "pass", photoIds: ["p3"], notes: "TCOD in operating position" },
    "ct-03": { status: "warning", photoIds: ["p3"], notes: "Guardrail chain partially loose" },
    "ct-04": { status: "pass", photoIds: ["p3", "p4"], notes: "Adequate lighting observed" },
    "ct-05": { status: "pass", photoIds: ["p4"], notes: "Ropes appear in good condition" },
    "ct-06": { status: "pass", photoIds: ["p4"], notes: "Clearance verified" },
    "pt-01": { status: "pass", photoIds: ["p5"], notes: "Pit stop switch accessible" },
    "pt-02": { status: "pass", photoIds: ["p5"], notes: "Lighting adequate" },
    "pt-03": { status: "pass", photoIds: ["p5"], notes: "Ladder in good condition" },
    "pt-04": { status: "pass", photoIds: ["p5"], notes: "GFCI outlet present" },
    "pt-05": { status: "warning", photoIds: ["p5"], notes: "Minor water staining observed on pit floor" },
    "pt-06": { status: "pass", photoIds: ["p5"], notes: "Buffers appear serviceable" },
    "pt-07": { status: "pass", photoIds: ["p5"], notes: "Clearance adequate" },
    "sd-01": { status: "pass", photoIds: ["p4"], notes: "Governor in good condition" },
    "sd-02": { status: "pass", photoIds: ["p6"], notes: "Door restrictor functional" },
    "sd-03": { status: "pass", photoIds: ["p6"], notes: "Door sensor responsive" },
    "sd-04": { status: "pass", photoIds: ["p3", "p5"], notes: "E-stops tested" },
    "ci-01": { status: "pass", photoIds: ["p6"], notes: "Emergency phone tested - connects to monitoring" },
    "ci-02": { status: "pass", photoIds: ["p6"], notes: "All buttons functional" },
    "ci-03": { status: "pass", photoIds: ["p6"], notes: "Car lighting adequate" },
    "ci-04": { status: "pass", photoIds: ["p6"], notes: "Door force acceptable" },
    "lo-01": { status: "fail", photoIds: ["p7"], notes: "Work observed on controller without personal lock on disconnect" },
    "lo-02": { status: "fail", photoIds: ["p7"], notes: "No tag visible on disconnect" },
    "lo-03": { status: "not_inspected", photoIds: [], notes: "Unable to verify - LOTO not properly applied" },
    "pp-01": { status: "pass", photoIds: ["p3", "p4", "p8"], notes: "All personnel wearing hard hats" },
    "pp-02": { status: "pass", photoIds: ["p3", "p8"], notes: "Safety glasses observed" },
    "pp-03": { status: "fail", photoIds: ["p3"], notes: "Worker on car top without visible tie-off" },
    "pp-04": { status: "pass", photoIds: ["p8"], notes: "Appropriate footwear observed" },
  };

  const result = results[item.id] || { status: "not_inspected", photoIds: [] };

  return {
    ...item,
    status: result.status || "not_inspected",
    photoIds: result.photoIds || [],
    notes: result.notes,
    aiConfidence: result.photoIds && result.photoIds.length > 0 ? "high" : "low",
  };
});

export const MOCK_PHOTOS = SAMPLE_PHOTOS;

export const MOCK_VISITS: Visit[] = [
  {
    id: "visit-1",
    name: "Venetian Tower A",
    location: "Las Vegas, NV",
    date: "2026-01-30",
    status: "ready",
    photoCount: 47,
    checklistResults: MOCK_CHECKLIST_RESULTS,
  },
  {
    id: "visit-2",
    name: "Aria Main Bank",
    location: "Las Vegas, NV",
    date: "2026-01-28",
    status: "analyzing",
    photoCount: 32,
  },
  {
    id: "visit-3",
    name: "Bellagio Service",
    location: "Las Vegas, NV",
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
  return ids.map((id) => MOCK_PHOTOS.find((p) => p.id === id)).filter(Boolean) as LegacyPhoto[];
}

export function getChecklistSummary(results: ChecklistResult[]) {
  const total = results.length;
  const pass = results.filter((r) => r.status === "pass").length;
  const fail = results.filter((r) => r.status === "fail").length;
  const warning = results.filter((r) => r.status === "warning").length;
  const notInspected = results.filter((r) => r.status === "not_inspected").length;
  const criticalFails = results.filter((r) => r.status === "fail" && r.criticalSafety).length;

  return {
    total,
    pass,
    fail,
    warning,
    notInspected,
    criticalFails,
    complianceRate: total > 0 ? Math.round((pass / (total - notInspected)) * 100) : 0,
  };
}

export function getResultsByCategory(results: ChecklistResult[], category: ChecklistCategory) {
  return results.filter((r) => r.category === category);
}
