import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { computeWorldState } from "@/lib/worldEngine";
import {
  buildImageSystemPrompt,
  buildImageUserPrompt,
  formatForImageGen,
  buildFallbackScenePrompt,
} from "@/lib/imagePrompt";
import { SliderValues } from "@/lib/forces";

// In-memory cache: keyed by sliders+year+region (not persona — same world view)
const cache = new Map<string, string>();

function cacheKey(sliders: SliderValues, year: number, regionId: string): string {
  return JSON.stringify({ s: sliders, y: year, r: regionId });
}

// Rate limiting: stricter than stories (5/hour due to cost)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_IMAGES = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= MAX_IMAGES) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sliders, year, regionId, storyText } = body as {
    sliders: SliderValues;
    year: number;
    regionId: string;
    storyText: string;
  };

  if (!sliders || !year || !regionId || !storyText) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const openaiKey = process.env.OPENAI_API_KEY;

  // No OpenAI key → graceful message
  if (!openaiKey) {
    return Response.json({
      error: "Add OPENAI_API_KEY to .env.local to enable Window View.",
      mock: true,
    });
  }

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Image rate limit exceeded (5/hour). Try again later." },
      { status: 429 },
    );
  }

  // Check cache
  const key = cacheKey(sliders, year, regionId);
  const cached = cache.get(key);
  if (cached) {
    return Response.json({ imageUrl: cached, cached: true });
  }

  // Compute world state
  const worldState = computeWorldState(sliders, year, regionId);

  // Stage 1: Get scene description from Haiku (or fallback)
  let scenePrompt: string;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: buildImageSystemPrompt(),
        messages: [
          {
            role: "user",
            content: buildImageUserPrompt(worldState, storyText),
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      const sceneDescription = textBlock?.text ?? "";
      scenePrompt = formatForImageGen(sceneDescription, worldState);
    } catch {
      // Fallback if Haiku fails
      scenePrompt = buildFallbackScenePrompt(worldState);
    }
  } else {
    // No Anthropic key — deterministic fallback
    scenePrompt = buildFallbackScenePrompt(worldState);
  }

  // Stage 2: Generate image with gpt-image-1
  try {
    const openai = new OpenAI({ apiKey: openaiKey });

    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: scenePrompt,
      n: 1,
      size: "1536x1024",
      quality: "low",
    });

    const b64 = imageResponse.data?.[0]?.b64_json;
    if (!b64) {
      return Response.json(
        { error: "Image generation returned no data" },
        { status: 500 }
      );
    }

    const imageUrl = `data:image/png;base64,${b64}`;

    // Cache it
    cache.set(key, imageUrl);

    return Response.json({ imageUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Image generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
