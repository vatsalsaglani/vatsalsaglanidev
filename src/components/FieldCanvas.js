"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// One particle per ~1800 px², so the count scales with area at constant density.
const SPACING = Math.sqrt(1800);
const POINTER_RADIUS = 240;
const MASK = "radial-gradient(ellipse 85% 80% at 50% 38%, #000 35%, transparent 100%)";

// Cheap 2D value noise (hashed lattice, smoothstep interpolation), output in [0, 1).
function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const readChannels = (name) => {
  const parts = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n)) ? parts.join(",") : "128,128,128";
};

export default function FieldCanvas({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let inView = true;
    let colors = { accent: "255,92,42", fg: "243,239,230" };
    // Pointer in canvas space; `px` eases toward `tx`. Off-canvas until the first move.
    const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const readColors = () => {
      colors = { accent: readChannels("--accent"), fg: readChannels("--fg") };
    };

    const draw = (time) => {
      const t = time * 0.00008;
      ptr.x += (ptr.tx - ptr.x) * 0.12;
      ptr.y += (ptr.ty - ptr.y) * 0.12;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineWidth = 1;

      const faint = new Path2D();
      const accentSoft = new Path2D();
      const accentHot = new Path2D();
      const pad = SPACING * 0.5;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = pad + i * SPACING;
          const y = pad + j * SPACING;
          let angle = noise(x * 0.0035 + t, y * 0.0035 - t * 0.7) * Math.PI * 4;
          let len = 3 + noise(x * 0.01 - t, y * 0.01 + 40) * 5;

          const dx = ptr.x - x;
          const dy = ptr.y - y;
          const dist2 = dx * dx + dy * dy;
          let near = 0;
          if (dist2 < POINTER_RADIUS * POINTER_RADIUS) {
            near = 1 - Math.sqrt(dist2) / POINTER_RADIUS;
            near *= near;
            // Turn along the shortest arc toward the cursor.
            let diff = Math.atan2(dy, dx) - angle;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            angle += diff * near * 0.9;
            len += near * 9;
          }

          const cx = Math.cos(angle) * len;
          const cy = Math.sin(angle) * len;
          const path = near > 0.12 ? accentHot : hash(i, j) > 0.86 ? accentSoft : faint;
          path.moveTo(x - cx * 0.5, y - cy * 0.5);
          path.lineTo(x + cx * 0.5, y + cy * 0.5);
        }
      }

      ctx.strokeStyle = `rgba(${colors.fg},0.1)`;
      ctx.stroke(faint);
      ctx.strokeStyle = `rgba(${colors.accent},0.3)`;
      ctx.stroke(accentSoft);
      ctx.strokeStyle = `rgba(${colors.accent},0.7)`;
      ctx.stroke(accentHot);
    };

    const loop = (time) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !inView || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / SPACING);
      rows = Math.ceil(h / SPACING);
      if (reduce) draw(0);
    };

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      ptr.tx = e.clientX - rect.left;
      ptr.ty = e.clientY - rect.top;
      if (ptr.x < -9000) {
        ptr.x = ptr.tx;
        ptr.y = ptr.ty;
      }
    };
    const onLeave = () => {
      ptr.tx = ptr.ty = -9999;
      ptr.x = ptr.y = -9999;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? start() : stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => (document.hidden ? stop() : start());

    readColors();
    resize();
    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}
