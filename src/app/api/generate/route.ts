import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeWorldState } from "@/lib/worldEngine";
import { buildPrompt, StoryOptions } from "@/lib/prompt";
import { SliderValues } from "@/lib/forces";

// Simple in-memory cache
const cache = new Map<string, string>();

function cacheKey(body: {
  sliders: SliderValues;
  year: number;
  regionId: string;
  persona: string;
  model: string;
  storyLength?: string;
  tone?: string;
  focusArea?: string;
}): string {
  return JSON.stringify({
    s: body.sliders,
    y: body.year,
    r: body.regionId,
    p: body.persona,
    m: body.model,
    sl: body.storyLength ?? "medium",
    t: body.tone ?? "literary",
    f: body.focusArea ?? "general",
  });
}

const MAX_TOKENS_BY_LENGTH: Record<string, number> = {
  short: 1500,
  medium: 3000,
  long: 5000,
};

// Rate limiting: track generation counts per session
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_GENERATIONS = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= MAX_GENERATIONS) return false;
  entry.count++;
  return true;
}

const MOCK_RESPONSE = `### World State Briefing

*Mock mode — no API key configured.*

The world state engine has computed the following scenario. To generate AI narratives, add your \`ANTHROPIC_API_KEY\` to \`.env.local\` and restart the server.

Review the **World State Preview** panel for the deterministic world state data computed from your slider configuration.

---

### Your Day

*Mock mode — set ANTHROPIC_API_KEY in .env.local to generate narratives.*

In mock mode, the simulator still computes the full deterministic world state from your slider positions. The AI narrative layer (this panel) requires a valid Anthropic API key.

To get started:
1. Visit https://console.anthropic.com/ to get an API key
2. Add it to \`.env.local\` as \`ANTHROPIC_API_KEY=sk-ant-...\`
3. Restart the dev server`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    sliders,
    year,
    regionId,
    persona,
    model = "claude-sonnet-4-6",
    storyLength = "medium",
    tone = "literary",
    focusArea = "general",
  } = body as {
    sliders: SliderValues;
    year: number;
    regionId: string;
    persona: string;
    model?: string;
    storyLength?: StoryOptions["length"];
    tone?: StoryOptions["tone"];
    focusArea?: StoryOptions["focus"];
  };

  // Validate inputs
  if (!sliders || !year || !regionId || !persona) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Mock mode if no API key
  if (!apiKey) {
    return Response.json({ text: MOCK_RESPONSE, mock: true });
  }

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in an hour." },
      { status: 429 }
    );
  }

  // Check cache
  const key = cacheKey({ sliders, year, regionId, persona, model, storyLength, tone, focusArea });
  const cached = cache.get(key);
  if (cached) {
    return Response.json({ text: cached, cached: true });
  }

  // Compute world state and build prompt
  const worldState = computeWorldState(sliders, year, regionId);
  const storyOptions: StoryOptions = { length: storyLength, tone, focus: focusArea };
  const { system, user } = buildPrompt(worldState, sliders, regionId, persona, storyOptions);

  // Call Claude with streaming
  const client = new Anthropic();

  const stream = await client.messages.stream({
    model,
    max_tokens: MAX_TOKENS_BY_LENGTH[storyLength] ?? 3000,
    system,
    messages: [{ role: "user", content: user }],
  });

  // Stream response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullText += event.delta.text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
          );
        }
      }
      // Cache the full response
      cache.set(key, fullText);
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
