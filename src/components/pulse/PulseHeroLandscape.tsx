"use client";

import { useRef, useEffect } from "react";

interface Props {
  height?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function drawHero(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // Warm brown/amber sky
  const sg = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  sg.addColorStop(0, "#3a2a1a");
  sg.addColorStop(0.4, "#6a4a2a");
  sg.addColorStop(0.7, "#9a7040");
  sg.addColorStop(1, "#c89860");
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, H);

  // Warm glow behind mountain
  const glowX = W * 0.72;
  const glowY = H * 0.35;
  const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, H * 0.45);
  glow.addColorStop(0, "rgba(220,170,100,0.5)");
  glow.addColorStop(0.4, "rgba(200,140,60,0.2)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Mountain — positioned right
  const peakX = W * 0.72;
  const peakY = H * 0.22;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * 0.35, H);
  ctx.bezierCurveTo(W * 0.45, H * 0.65, peakX - W * 0.08, peakY + H * 0.05, peakX, peakY);
  ctx.bezierCurveTo(peakX + W * 0.08, peakY + H * 0.05, W * 0.95, H * 0.55, W * 1.1, H);
  ctx.closePath();
  const mg = ctx.createLinearGradient(0, peakY, 0, H);
  mg.addColorStop(0, "#7a5a30");
  mg.addColorStop(0.15, "#5a4020");
  mg.addColorStop(0.4, "#3a2a15");
  mg.addColorStop(1, "#1a1008");
  ctx.fillStyle = mg;
  ctx.fill();

  // Dark left face of mountain
  ctx.beginPath();
  ctx.moveTo(W * 0.35, H);
  ctx.bezierCurveTo(W * 0.45, H * 0.65, peakX - W * 0.08, peakY + H * 0.05, peakX, peakY);
  ctx.lineTo(peakX - W * 0.05, H);
  ctx.closePath();
  const df = ctx.createLinearGradient(W * 0.35, peakY, peakX, H);
  df.addColorStop(0, "rgba(10,8,5,0)");
  df.addColorStop(0.4, "rgba(10,8,5,0.5)");
  df.addColorStop(1, "rgba(5,3,2,0.85)");
  ctx.fillStyle = df;
  ctx.fill();
  ctx.restore();

  // Peak glow
  const pg = ctx.createRadialGradient(peakX, peakY, 0, peakX, peakY, W * 0.15);
  const [gr, gg, gb] = hexToRgb("#c89860");
  pg.addColorStop(0, `rgba(${gr},${gg},${gb},0.4)`);
  pg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = pg;
  ctx.fillRect(0, 0, W, H);

  // Foreground ground plane
  const gg2 = ctx.createLinearGradient(0, H * 0.7, 0, H);
  gg2.addColorStop(0, "#2a1a0a");
  gg2.addColorStop(1, "#0a0805");
  ctx.fillStyle = gg2;
  ctx.fillRect(0, H * 0.7, W, H);

  // Subtle ground line
  ctx.beginPath();
  for (let x = 0; x <= W; x += W / 60) {
    const y = H * 0.7 + H * 0.01 * Math.sin((x / W) * Math.PI * 3);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = "#1a1008";
  ctx.fill();

  // Figure — small, on the left, looking toward mountain
  const figX = W * 0.18;
  const figY = H * 0.69;
  const fH = H * 0.032;
  ctx.save();
  ctx.fillStyle = "#0a0806";
  // Body
  ctx.beginPath();
  ctx.ellipse(figX, figY - fH * 0.3, fH * 0.12, fH * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(figX, figY - fH * 0.8, fH * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Film grain
  const id = ctx.getImageData(0, 0, W, H);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);

  // Vignette
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

export default function PulseHeroLandscape({ height = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const id = requestAnimationFrame(() => drawHero(canvas));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={Math.round(1200 * (height / 600))}
      style={{ width: "100%", height, display: "block" }}
      className="rounded-lg"
    />
  );
}
