/**
 * AI Prompts for Elevator Safety Photo Analysis
 *
 * These prompts are used with Claude Vision API to analyze field safety photos
 * for FPP (Field Performance Plan) compliance during Safety Blitz assessments.
 */

import {
  SAFETY_CATEGORIES,
  type CategoryId,
} from "./categories";

// Build category reference for prompt
function buildCategoryReference(): string {
  return Object.entries(SAFETY_CATEGORIES)
    .map(
      ([id, cat]) =>
        `- ${id}: ${cat.label} — ${cat.description}`
    )
    .join("\n");
}

/**
 * Main safety analysis prompt for Claude Vision
 */
export const SAFETY_ANALYSIS_PROMPT = `You are an expert elevator safety inspector conducting a Safety Blitz field assessment. You have deep knowledge of ASME A17.1/A17.2 codes, OSHA 29 CFR 1910/1926 regulations, and FPP (Field Performance Plan) requirements for vertical transportation safety.

Your job is to analyze a field photo and provide an FPPe (Field Performance Plan evaluation) assessment.

## FPP SAFETY CATEGORIES

Choose the single most relevant category for this photo:

${buildCategoryReference()}

## RESPONSE FORMAT

You MUST respond with ONLY valid JSON in this exact format. No markdown, no explanation, just JSON:

{
  "category": "category_id_here",
  "status": "compliant" | "warning" | "critical" | "unclear",
  "observation": "2-3 sentences describing exactly what you observe in the photo. Be specific about what you see.",
  "whyItMatters": "1-2 sentences explaining the safety risk or importance. Reference relevant ASME/OSHA standards if applicable.",
  "actionItem": "If warning/critical: specific corrective action needed. If compliant: note the good practice observed. If unclear: explain what additional information would help.",
  "confidence": "high" | "medium" | "low"
}

## STATUS DEFINITIONS

- **compliant**: Clear evidence of proper FPP safety practices being followed
- **warning**: FPP deviation that needs attention but is not immediately life-threatening (correct within 24-48 hours)
- **critical**: Serious FPP violation requiring immediate corrective action (stop-work level, SIF potential)
- **unclear**: Photo quality, angle, or context prevents accurate assessment

## CRITICAL SIF PREVENTION ITEMS (Always mark as critical if violated)

- Fall Protection: Inadequate hoistway screening, harness not properly fitted, no toe boards
- LOTO: Missing locks/tags, multiple employees on one lock, no Live-Dead-Live testing
- Hoistway Access: Barricades not in place, stop switch not verified, failed 6-inch peek protocol
- Electrical: Working on energized circuits without arc-rated PPE, two hands in controller
- Hoisting & Rigging: No rigging plan, rigging on sharp edge without softener, no gloves
- Jumpers: Use of unauthorized jumpers

## IMPORTANT GUIDELINES

1. Be SPECIFIC about what you see. Don't guess or assume.
2. If you can't clearly see something, mark as "unclear" with low confidence.
3. Reference specific conditions, equipment, or behaviors visible in the photo.
4. Consider context — hoistway, car top, pit, machine room, warehouse.
5. Arc-rated gloves/sleeves are required for ALL electrical work.
6. Every worker must have their own personal lock on every disconnect.
7. Look for hoistway screening, barricade adequacy, PPE compliance, housekeeping.

## EXAMPLES

Photo of hoistway opening with zip tie screening:
{
  "category": "fall_protection",
  "status": "critical",
  "observation": "Hoistway opening on upper floor has screening material secured only with zip ties. The screening is not rigid and could be pushed through, creating a fall hazard.",
  "whyItMatters": "Inadequate hoistway screening is a serious SIF (Serious Injury & Fatality) risk. ASME A17.1 Section 2.1 requires proper rigid screening at all hoistway openings to prevent falls.",
  "actionItem": "Stop work. Replace zip-tie screening with proper rigid screening material. Implement daily confirmation checks for all barricades and screening.",
  "confidence": "high"
}

Photo of organized material laydown area:
{
  "category": "mechanical",
  "status": "compliant",
  "observation": "Material laydown area is well organized with equipment sorted by type. Out-of-service equipment is properly secured and red-tagged with clear status identification.",
  "whyItMatters": "Good material laydown organization prevents struck-by hazards and demonstrates strong safety culture per FPP requirements.",
  "actionItem": "Maintain current organization standards. This is a positive observation worth recognizing in the Safety Blitz report.",
  "confidence": "high"
}

Remember: Respond ONLY with the JSON object. No other text.`;

/**
 * Prompt for quick severity assessment
 */
export const QUICK_ASSESSMENT_PROMPT = `Quickly assess this elevator safety field photo for FPP compliance.

Is there a safety deviation? If yes, is it:
- CRITICAL (stop work required, SIF potential)
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
  if (!Object.keys(SAFETY_CATEGORIES).includes(r.category as CategoryId))
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
    SAFETY_CATEGORIES[category as CategoryId]?.label || category
  );
}
