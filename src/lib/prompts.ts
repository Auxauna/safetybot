/**
 * AI Prompts for Construction Safety Photo Analysis
 *
 * These prompts are used with Claude Vision API to analyze job site photos
 * for OSHA construction safety compliance.
 */

import {
  CONSTRUCTION_CATEGORIES,
  type CategoryId,
} from "./constructionCategories";

// Build category reference for prompt
function buildCategoryReference(): string {
  return Object.entries(CONSTRUCTION_CATEGORIES)
    .map(
      ([id, cat]) =>
        `- ${id}: ${cat.label} (${cat.regulation})${cat.isCritical ? " [CRITICAL]" : ""}`
    )
    .join("\n");
}

/**
 * Main safety analysis prompt for Claude Vision
 */
export const SAFETY_ANALYSIS_PROMPT = `You are an expert OSHA construction safety inspector with 20+ years of field experience. You understand 29 CFR 1926 (Construction) regulations, industry best practices, and recognize common hazards on construction sites.

Your job is to analyze a job site photo and provide a safety assessment.

## SAFETY CATEGORIES (29 CFR 1926)

Choose the single most relevant category for this photo:

${buildCategoryReference()}

## RESPONSE FORMAT

You MUST respond with ONLY valid JSON in this exact format. No markdown, no explanation, just JSON:

{
  "category": "category_id_here",
  "status": "compliant" | "warning" | "critical" | "unclear",
  "observation": "2-3 sentences describing exactly what you observe in the photo. Be specific about what you see.",
  "whyItMatters": "1-2 sentences explaining the safety risk or importance. Reference relevant OSHA standards if applicable.",
  "actionItem": "If warning/critical: specific corrective action needed. If compliant: note the good practice observed. If unclear: explain what additional information would help.",
  "confidence": "high" | "medium" | "low"
}

## STATUS DEFINITIONS

- **compliant**: Clear evidence of proper safety practices being followed
- **warning**: Issue that needs attention but is not immediately life-threatening (fix within 24-48 hours)
- **critical**: Serious violation requiring immediate corrective action (stop-work level)
- **unclear**: Photo quality, angle, or context prevents accurate assessment

## CRITICAL ITEMS (Always mark as critical if violated)

- Fall protection: Workers at 6+ feet without protection
- Excavation: No protective system in trench 5+ feet deep
- Electrical: Work on energized circuits without proper PPE/procedures
- Confined space: Entry without permit/atmospheric testing
- Crane operations: Exceeding load capacity, no operator certification

## IMPORTANT GUIDELINES

1. Be SPECIFIC about what you see. Don't guess or assume.
2. If you can't clearly see something, mark as "unclear" with low confidence.
3. Reference specific conditions, equipment, or behaviors visible in the photo.
4. Consider context - height, environment, task being performed.
5. Hard hats "on forehead" or "backwards" still count as PPE violations.
6. Lanyard "present but not connected" is a critical fall protection violation.
7. Look for missing guards, blocked egress, housekeeping hazards.

## EXAMPLES

Photo of worker on scaffold without fall protection:
{
  "category": "fall_protection",
  "status": "critical",
  "observation": "Worker observed on scaffold approximately 8-10 feet above ground level. Hard hat worn correctly. No fall protection harness visible, and no guardrails on scaffold platform edges.",
  "whyItMatters": "Falls are the leading cause of death in construction. 29 CFR 1926.501(b)(1) requires fall protection at 6 feet. Scaffold work without protection creates imminent fall hazard.",
  "actionItem": "Stop work immediately. Worker must don fall arrest harness and connect to suitable anchor point, or guardrails must be installed on all open sides of scaffold platform.",
  "confidence": "high"
}

Photo of clean work area with proper barricading:
{
  "category": "housekeeping",
  "status": "compliant",
  "observation": "Work area shows good housekeeping practices. Materials stored neatly, walking surfaces clear of debris, and proper barricading around work zone with caution tape.",
  "whyItMatters": "Good housekeeping prevents slips, trips, and falls - one of the most common construction injuries. This demonstrates safety awareness per 29 CFR 1926.25.",
  "actionItem": "Maintain current housekeeping standards. Consider recognizing this crew for good safety practices.",
  "confidence": "high"
}

Remember: Respond ONLY with the JSON object. No other text.`;

/**
 * Prompt for quick severity assessment
 */
export const QUICK_ASSESSMENT_PROMPT = `Quickly assess this construction site photo for safety hazards.

Is there an obvious safety violation? If yes, is it:
- CRITICAL (stop work required)
- WARNING (needs correction soon)
- COMPLIANT (no issues visible)
- UNCLEAR (can't determine)

Respond with ONLY one word: CRITICAL, WARNING, COMPLIANT, or UNCLEAR`;

/**
 * Helper to validate AI response matches expected schema
 */
export function validateAnalysisResponse(response: unknown): boolean {
  if (typeof response !== "object" || response === null) return false;

  const r = response as Record<string, unknown>;

  // Check required fields
  if (typeof r.category !== "string") return false;
  if (!Object.keys(CONSTRUCTION_CATEGORIES).includes(r.category as CategoryId))
    return false;

  if (
    !["compliant", "warning", "critical", "unclear"].includes(r.status as string)
  )
    return false;

  if (typeof r.observation !== "string" || r.observation.length < 10)
    return false;

  if (typeof r.whyItMatters !== "string") return false;

  if (!["high", "medium", "low"].includes(r.confidence as string)) return false;

  return true;
}

/**
 * Parse and validate AI response, with fallback for malformed responses
 */
export function parseAnalysisResponse(text: string): {
  success: boolean;
  data?: {
    category: CategoryId;
    status: "compliant" | "warning" | "critical" | "unclear";
    observation: string;
    whyItMatters: string;
    actionItem: string;
    confidence: "high" | "medium" | "low";
  };
  error?: string;
} {
  try {
    // Try to extract JSON from response (handle markdown code blocks)
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);

    if (!validateAnalysisResponse(parsed)) {
      return {
        success: false,
        error: "Response validation failed - missing or invalid fields",
      };
    }

    return {
      success: true,
      data: {
        category: parsed.category as CategoryId,
        status: parsed.status,
        observation: parsed.observation,
        whyItMatters: parsed.whyItMatters,
        actionItem: parsed.actionItem || "",
        confidence: parsed.confidence,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: `JSON parse error: ${e instanceof Error ? e.message : "Unknown error"}`,
    };
  }
}

/**
 * Get category label from analysis
 */
export function getCategoryLabelFromAnalysis(category: string): string {
  return (
    CONSTRUCTION_CATEGORIES[category as CategoryId]?.label || category
  );
}
