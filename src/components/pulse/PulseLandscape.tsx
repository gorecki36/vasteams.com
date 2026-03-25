"use client";

import { useRef, useEffect } from "react";
import type { PulseScores } from "@/lib/pulse-scoring";

interface Props {
  scores: PulseScores;
  height?: number;
}

// ── Color helpers ──

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bl = Math.round(lerp(ab, bb, t));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

// ── Scene parameters from scores ──

interface SceneParams {
  sceneType: string;
  skyTop: string;
  skyMid: string;
  skyBot: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  groundDark: string;
  fogOpacity: number;
  figureX: number;
  arcX: number;
  arcSize: number;
  terrainHeight: number;
  glowIntensity: number;
  grainAmount: number;
  label: string;
  sublabel: string;
}

function scoresToParams(s: PulseScores): SceneParams {
  // Normalize scores to 0-1 range (from 1-7)
  const sub = (s.substitution - 1) / 6;
  const exp = (s.expansion - 1) / 6;
  const agency = (s.agency - 1) / 6;
  const meaning = (s.meaning - 1) / 6;
  const risk = (s.risk - 1) / 6;

  // Scene selection based on dominant pattern
  let scene: string;
  let label: string;
  let sublabel: string;

  if (risk > 0.7) {
    scene = "fire";
    label = "Burning";
    sublabel = "High compulsion. The inability to stop is becoming the landscape.";
  } else if (agency < 0.3 && meaning < 0.3) {
    scene = "ice";
    label = "Frozen";
    sublabel = "Low agency, low meaning. Stuck in place.";
  } else if (exp > 0.55 && sub < 0.45) {
    scene = "mountain";
    label = "Amplified";
    sublabel = "AI is expanding your reach without replacing your thinking.";
  } else if (exp > 0.5 && sub > 0.5) {
    scene = "cliff";
    label = "Dependent Explorer";
    sublabel = "AI opens doors, but you're leaning on it heavily. Watch the edge.";
  } else if (meaning > 0.55 && exp > 0.4) {
    scene = "sea";
    label = "Purposeful";
    sublabel = "Work feels meaningful and AI is broadening your horizon.";
  } else if (sub > 0.55 && exp < 0.45) {
    scene = "desert";
    label = "At Risk";
    sublabel = "AI is doing the thinking without expanding your reach.";
  } else {
    scene = "hills";
    label = "Steady";
    sublabel = "Balanced. Stable progress without extremes.";
  }

  // Map scores to visual parameters
  const warmth = (meaning + agency) / 2; // warm = purposeful
  const intensity = (exp + sub) / 2; // how dramatic
  const darkness = 1 - agency; // low agency = darker

  const skyWarm = warmth > 0.5;
  const skyTop = skyWarm
    ? lerpColor("#4a5a6a", "#c87830", warmth)
    : lerpColor("#1a2a3a", "#6a7e8a", warmth);
  const skyMid = skyWarm
    ? lerpColor("#6a7a8a", "#d8a050", warmth)
    : lerpColor("#3a4a5a", "#8aa0a8", warmth);
  const skyBot = skyWarm
    ? lerpColor("#8a9aa8", "#e8c870", warmth)
    : lerpColor("#5a6a7a", "#a8bcb8", warmth);

  return {
    sceneType: scene,
    skyTop,
    skyMid,
    skyBot,
    color1: lerpColor("#1a3a5a", "#e08020", warmth),
    color2: lerpColor("#2a5070", "#c05010", intensity),
    color3: lerpColor("#4a7040", "#8a6030", sub),
    color4: lerpColor("#5a8050", "#6a4020", darkness),
    groundDark: lerpColor("#0a1810", "#1a0a05", warmth),
    fogOpacity: lerp(0.08, 0.35, 1 - agency),
    figureX: lerp(20, 60, exp),
    arcX: lerp(50, 80, meaning),
    arcSize: lerp(30, 80, intensity),
    terrainHeight: lerp(8, 35, intensity),
    glowIntensity: lerp(0.3, 1.3, warmth),
    grainAmount: lerp(12, 40, risk),
    label,
    sublabel,
  };
}

// ── Drawing functions ──

function drawSky(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams, horizon = 0.55) {
  const g = ctx.createLinearGradient(0, 0, 0, H * horizon);
  g.addColorStop(0, p.skyTop);
  g.addColorStop(0.6, p.skyMid);
  g.addColorStop(1, p.skyBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H * horizon + 2);
}

function drawGrain(ctx: CanvasRenderingContext2D, W: number, H: number, amount: number) {
  if (amount <= 0) return;
  const id = ctx.getImageData(0, 0, W, H);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);
}

function drawVignette(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function drawFigure(ctx: CanvasRenderingContext2D, x: number, y: number, H: number) {
  const fH = H * 0.028;
  ctx.save();
  ctx.fillStyle = "#0a0806";
  ctx.beginPath();
  ctx.ellipse(x, y - fH * 0.3, fH * 0.12, fH * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - fH * 0.75, fH * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ── Scene renderers ──

function sceneMountain(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  drawSky(ctx, W, H, p, 0.7);
  // Arc
  const arcCX = W * (p.arcX / 100);
  const arcR = H * (p.arcSize / 100) * 1.5;
  const [ar, ag, ab] = hexToRgb(p.color1);
  ctx.save();
  ctx.beginPath();
  ctx.arc(arcCX, H * 1.05, arcR, Math.PI * 1.95, Math.PI * 1.05, true);
  ctx.closePath();
  const ag2 = ctx.createLinearGradient(0, 0, 0, H * 0.5);
  ag2.addColorStop(0, `rgba(${Math.max(0, ar - 25)},${Math.max(0, ag - 25)},${Math.max(0, ab - 25)},0.95)`);
  ag2.addColorStop(1, `rgba(${Math.min(255, ar + 15)},${Math.min(255, ag + 15)},${Math.min(255, ab + 15)},0.75)`);
  ctx.fillStyle = ag2;
  ctx.fill();
  ctx.restore();
  // Peak
  const peakX = W * (p.figureX / 100);
  const peakY = H * (0.48 - p.terrainHeight / 180);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-W * 0.05, H * 1.05);
  ctx.bezierCurveTo(W * 0.15, H * 0.75, peakX - W * 0.1, peakY + H * 0.06, peakX, peakY);
  ctx.bezierCurveTo(peakX + W * 0.1, peakY + H * 0.06, W * 0.95, H * 0.75, W * 1.05, H * 1.05);
  ctx.closePath();
  const gg = ctx.createLinearGradient(0, peakY, 0, H);
  gg.addColorStop(0, p.color3);
  gg.addColorStop(0.1, p.color2);
  gg.addColorStop(0.5, p.color4);
  gg.addColorStop(1, p.groundDark);
  ctx.fillStyle = gg;
  ctx.fill();
  ctx.restore();
  // Glow
  const pg = ctx.createRadialGradient(peakX, peakY, 0, peakX, peakY, W * 0.25);
  const [gr, gg2, gb] = hexToRgb(p.color3);
  pg.addColorStop(0, `rgba(${gr},${gg2},${gb},${0.5 * p.glowIntensity})`);
  pg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = pg;
  ctx.fillRect(0, 0, W, H);
  drawFigure(ctx, peakX, peakY, H);
}

function sceneSea(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  const horizon = 0.45;
  drawSky(ctx, W, H, p, horizon);
  // Water
  const wg = ctx.createLinearGradient(0, H * horizon, 0, H);
  wg.addColorStop(0, p.color1);
  wg.addColorStop(0.3, p.color2);
  wg.addColorStop(0.7, p.color4);
  wg.addColorStop(1, p.groundDark);
  ctx.fillStyle = wg;
  ctx.fillRect(0, H * horizon, W, H);
  // Shimmer
  for (let i = 0; i < 8; i++) {
    const y = H * horizon + (H * (1 - horizon)) * (i / 8) * 0.85;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(W * 0.3, y - 3, W * 0.7, y + 2, W, y - 1);
    ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - i / 10)})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  // Sun
  const sunX = W * (p.arcX / 100);
  const sunY = H * (horizon - 0.05);
  const [sr, sg, sb] = hexToRgb(p.color1);
  const sunG = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.15);
  sunG.addColorStop(0, `rgba(${sr},${sg},${sb},0.9)`);
  sunG.addColorStop(0.5, `rgba(${sr},${sg},${sb},0.3)`);
  sunG.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sunG;
  ctx.fillRect(0, 0, W, H);
  // Fog
  const fg = ctx.createLinearGradient(0, H * (horizon - 0.08), 0, H * (horizon + 0.1));
  const [fr, fgg, fb] = hexToRgb(p.skyBot);
  fg.addColorStop(0, `rgba(${fr},${fgg},${fb},0)`);
  fg.addColorStop(0.5, `rgba(${fr},${fgg},${fb},${p.fogOpacity * 0.8})`);
  fg.addColorStop(1, `rgba(${fr},${fgg},${fb},0)`);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, W, H);
  drawFigure(ctx, W * 0.15, H * (horizon + 0.02), H);
}

function sceneHills(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  drawSky(ctx, W, H, p, 0.5);
  const layers = [
    { yBase: 0.42, col: p.color1, alpha: 0.9 },
    { yBase: 0.52, col: p.color2, alpha: 1.0 },
    { yBase: 0.62, col: p.color3, alpha: 1.0 },
    { yBase: 0.72, col: p.color4, alpha: 1.0 },
  ];
  layers.forEach(({ yBase, col, alpha }) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let i = 0; i <= 6; i++) {
      const x = W * (i / 6);
      const phase = (i / 6) * Math.PI * 2.5 + yBase * 10;
      const y = H * (yBase - 0.08 * Math.sin(phase));
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const hg = ctx.createLinearGradient(0, H * yBase, 0, H);
    hg.addColorStop(0, col);
    hg.addColorStop(1, p.groundDark);
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.restore();
  });
  // Fog
  const fg = ctx.createLinearGradient(0, H * 0.35, 0, H * 0.75);
  const [fr, fgg, fb] = hexToRgb(p.skyBot);
  fg.addColorStop(0, `rgba(${fr},${fgg},${fb},0)`);
  fg.addColorStop(0.5, `rgba(${fr},${fgg},${fb},${p.fogOpacity})`);
  fg.addColorStop(1, `rgba(${fr},${fgg},${fb},0)`);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, W, H);
  const figX = W * (p.figureX / 100);
  drawFigure(ctx, figX, H * 0.66, H);
}

function sceneCliff(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  drawSky(ctx, W, H, p, 0.55);
  // Sea
  const sg = ctx.createLinearGradient(0, H * 0.45, 0, H);
  sg.addColorStop(0, p.color1);
  sg.addColorStop(0.5, p.color2);
  sg.addColorStop(1, p.groundDark);
  ctx.fillStyle = sg;
  ctx.fillRect(0, H * 0.45, W, H);
  // Cliff
  const cliffTop = 0.38 + (p.terrainHeight / 100) * 0.12;
  const cliffEdge = W * (p.figureX / 100 + 0.15);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, H * cliffTop);
  ctx.bezierCurveTo(W * 0.2, H * (cliffTop - 0.02), cliffEdge - W * 0.12, H * (cliffTop + 0.01), cliffEdge, H * (cliffTop + 0.02));
  ctx.bezierCurveTo(cliffEdge + W * 0.04, H * (cliffTop + 0.12), cliffEdge + W * 0.05, H * 0.62, cliffEdge + W * 0.03, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  const cg = ctx.createLinearGradient(0, H * cliffTop, 0, H);
  cg.addColorStop(0, p.color3);
  cg.addColorStop(0.15, p.color4);
  cg.addColorStop(1, p.groundDark);
  ctx.fillStyle = cg;
  ctx.fill();
  // Shadow face
  ctx.beginPath();
  ctx.moveTo(cliffEdge, H * (cliffTop + 0.02));
  ctx.bezierCurveTo(cliffEdge + W * 0.04, H * (cliffTop + 0.12), cliffEdge + W * 0.05, H * 0.62, cliffEdge + W * 0.03, H);
  ctx.lineTo(cliffEdge - W * 0.01, H);
  ctx.closePath();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fill();
  ctx.restore();
  drawFigure(ctx, cliffEdge - W * 0.04, H * (cliffTop + 0.01), H);
}

function sceneDesert(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  const sg = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  sg.addColorStop(0, p.skyTop);
  sg.addColorStop(0.5, p.skyMid);
  sg.addColorStop(1, p.skyBot);
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, H);
  // Sun
  const sunX = W * (p.arcX / 100);
  const sunR = H * (p.arcSize / 100) * 0.18;
  const [sr, sg2, sb] = hexToRgb(p.color1);
  const sunG = ctx.createRadialGradient(sunX, H * 0.22, 0, sunX, H * 0.22, sunR * 2.5);
  sunG.addColorStop(0, `rgba(${sr},${sg2},${sb},0.95)`);
  sunG.addColorStop(0.4, `rgba(${sr},${sg2},${sb},0.4)`);
  sunG.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sunG;
  ctx.fillRect(0, 0, W, H);
  // Dunes
  [[0.55, p.color2], [0.62, p.color3], [0.70, p.color4], [0.78, p.groundDark]].forEach(([yB, col], i) => {
    ctx.save();
    ctx.beginPath();
    const phase = i * 1.3;
    for (let x = 0; x <= W; x += W / 40) {
      const y = H * ((yB as number) + 0.06 * Math.sin((x / W) * Math.PI * 3 + phase));
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const dg = ctx.createLinearGradient(0, H * (yB as number), 0, H);
    dg.addColorStop(0, col as string);
    dg.addColorStop(1, p.groundDark);
    ctx.fillStyle = dg;
    ctx.fill();
    ctx.restore();
  });
  drawFigure(ctx, W * (p.figureX / 100), H * 0.68, H);
}

function sceneFire(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  // Apocalyptic sky
  const sg = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  sg.addColorStop(0, "#1a0505");
  sg.addColorStop(0.3, "#3a0a08");
  sg.addColorStop(0.6, "#8a2010");
  sg.addColorStop(1, "#c04018");
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, H);
  // Lava glow from below
  const lavaG = ctx.createLinearGradient(0, H * 0.5, 0, H);
  lavaG.addColorStop(0, "rgba(200,60,20,0)");
  lavaG.addColorStop(0.4, "rgba(200,60,20,0.15)");
  lavaG.addColorStop(0.7, "rgba(220,80,10,0.35)");
  lavaG.addColorStop(1, "rgba(180,40,5,0.8)");
  ctx.fillStyle = lavaG;
  ctx.fillRect(0, 0, W, H);
  // Cracked terrain
  const terrainY = H * 0.58;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += W / 30) {
    const y = terrainY + H * 0.03 * Math.sin((x / W) * Math.PI * 5) + H * 0.02 * Math.sin((x / W) * Math.PI * 12);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  const tg = ctx.createLinearGradient(0, terrainY, 0, H);
  tg.addColorStop(0, "#2a1008");
  tg.addColorStop(0.3, "#1a0805");
  tg.addColorStop(1, "#0a0403");
  ctx.fillStyle = tg;
  ctx.fill();
  ctx.restore();
  // Ember glow cracks
  for (let i = 0; i < 5; i++) {
    const cx = W * (0.1 + i * 0.2);
    const cy = terrainY + H * 0.08 + Math.random() * H * 0.15;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.06);
    cg.addColorStop(0, "rgba(220,80,10,0.25)");
    cg.addColorStop(1, "rgba(220,80,10,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);
  }
  drawFigure(ctx, W * (p.figureX / 100), terrainY - H * 0.01, H);
}

function sceneIce(ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) {
  // Cold pale sky
  const sg = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  sg.addColorStop(0, "#c8d0d8");
  sg.addColorStop(0.5, "#a8b8c8");
  sg.addColorStop(1, "#8898a8");
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, H);
  // Flat frozen ground
  const horizon = 0.52;
  const gg = ctx.createLinearGradient(0, H * horizon, 0, H);
  gg.addColorStop(0, "#b8c8d0");
  gg.addColorStop(0.3, "#98a8b8");
  gg.addColorStop(0.6, "#7888a0");
  gg.addColorStop(1, "#506080");
  ctx.fillStyle = gg;
  ctx.fillRect(0, H * horizon, W, H);
  // Ice ridges
  ctx.save();
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 3; i++) {
    const y = H * (horizon + 0.05 + i * 0.08);
    ctx.beginPath();
    for (let x = 0; x <= W; x += W / 50) {
      const ry = y + H * 0.015 * Math.sin((x / W) * Math.PI * (4 + i) + i * 2);
      x === 0 ? ctx.moveTo(x, ry) : ctx.lineTo(x, ry);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = `rgba(180,200,220,${0.3 - i * 0.08})`;
    ctx.fill();
  }
  ctx.restore();
  // Pale sun barely visible
  const sunG = ctx.createRadialGradient(W * 0.6, H * 0.25, 0, W * 0.6, H * 0.25, H * 0.12);
  sunG.addColorStop(0, "rgba(220,225,230,0.5)");
  sunG.addColorStop(1, "rgba(220,225,230,0)");
  ctx.fillStyle = sunG;
  ctx.fillRect(0, 0, W, H);
  // Heavy fog
  const fg = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.7);
  fg.addColorStop(0, "rgba(180,190,200,0)");
  fg.addColorStop(0.5, `rgba(180,190,200,${Math.min(0.5, p.fogOpacity + 0.2)})`);
  fg.addColorStop(1, "rgba(180,190,200,0)");
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, W, H);
  drawFigure(ctx, W * (p.figureX / 100), H * (horizon - 0.01), H);
}

// ── Main draw ──

const SCENES: Record<string, (ctx: CanvasRenderingContext2D, W: number, H: number, p: SceneParams) => void> = {
  mountain: sceneMountain,
  sea: sceneSea,
  hills: sceneHills,
  cliff: sceneCliff,
  desert: sceneDesert,
  fire: sceneFire,
  ice: sceneIce,
};

function drawScene(canvas: HTMLCanvasElement, p: SceneParams) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const fn = SCENES[p.sceneType] || sceneMountain;
  fn(ctx, W, H, p);
  drawGrain(ctx, W, H, p.grainAmount);
  drawVignette(ctx, W, H);
}

// ── Component ──

export default function PulseLandscape({ scores, height = 320 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = scoresToParams(scores);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const id = requestAnimationFrame(() => drawScene(canvas, params));
    return () => cancelAnimationFrame(id);
  }, [scores]);

  return (
    <div className="rounded-lg overflow-hidden border border-zinc-200">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={Math.round(1200 * (height / 600))}
          style={{ width: "100%", height, display: "block" }}
        />
        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-lg font-bold font-mono tracking-wide">
            {params.label}
          </p>
          <p className="text-white/70 text-sm font-mono mt-1">
            {params.sublabel}
          </p>
        </div>
      </div>
    </div>
  );
}
