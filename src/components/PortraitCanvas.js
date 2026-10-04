"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Halftone portrait: the photo is sampled on a grid and drawn as dots whose size
// follows luminance, in the current theme's ink colour. Hovering fades the real
// photo through the dots. Colours come from CSS variables so both themes work.
const CELL = 6; // CSS px between dot centres
const MAX_DPR = 2;

const readVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function PortraitCanvas({ src, alt, className = "", focus = { x: 0.5, y: 0.5 }, zoom = 1 }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const img = new Image();
    img.decoding = "async";
    img.src = src;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let lum = null; // Float32Array of luminance per cell
    let crop = null; // source rect for object-fit: cover
    let colors = { ink: "243 239 230", accent: "255 92 42", surface: "17 17 22" };
    const pointer = { x: -1e4, y: -1e4, inside: 0 }; // inside eases 0..1 for the photo reveal
    let t0 = performance.now();

    const refreshColors = () => {
      colors = { ink: readVar("--fg") || colors.ink, accent: readVar("--accent") || colors.accent, surface: readVar("--surface") || colors.surface };
    };

    const sample = () => {
      if (!img.complete || !img.naturalWidth || !w || !h) return;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      // Cover-crop the source to the canvas aspect ratio, zoomed in on the focus point.
      const ar = w / h;
      const iar = img.naturalWidth / img.naturalHeight;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (iar > ar) sw = sh * ar;
      else sh = sw / ar;
      sw /= zoom;
      sh /= zoom;
      const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
      const sx = clamp(focus.x * img.naturalWidth - sw / 2, 0, img.naturalWidth - sw);
      const sy = clamp(focus.y * img.naturalHeight - sh / 2, 0, img.naturalHeight - sh);
      crop = { sx, sy, sw, sh };
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sample();
      draw(performance.now());
    };

    const draw = (now) => {
      if (!lum) return;
      const dark = document.documentElement.getAttribute("data-theme") !== "light";
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Real photo underneath, revealed on hover.
      if (pointer.inside > 0.01 && crop) {
        ctx.save();
        ctx.globalAlpha = pointer.inside;
        ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h);
        ctx.restore();
      }

      ctx.fillStyle = `rgb(${colors.ink} / ${1 - pointer.inside * 0.85})`;
      const accent = `rgb(${colors.accent} / ${0.9 - pointer.inside * 0.8})`;
      const maxR = CELL * 0.62;
      ctx.beginPath();
      let accentPath = null;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const l = lum[j * cols + i];
          // Dark theme: light ink on dark surface, bigger dots where the photo is bright.
          // Light theme: dark ink on paper, bigger dots where the photo is dark.
          let v = dark ? l : 1 - l;
          v = Math.pow(v, 1.35);
          if (v < 0.04) continue;
          let x = i * CELL + CELL / 2;
          let y = j * CELL + CELL / 2;
          // Slow breathing wave across the grid.
          const wave = reduce ? 0 : 0.08 * Math.sin(t * 1.1 + x * 0.02 + y * 0.015);
          let r = Math.max(0, (v + wave) * maxR);
          // Push dots away from the pointer.
          if (!reduce) {
            const dx = x - pointer.x, dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            const R = 110;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / R) * 14;
              x += (dx / d) * f;
              y += (dy / d) * f;
              r *= 1 + (1 - d / R) * 0.6;
              if (!accentPath) accentPath = new Path2D();
              accentPath.moveTo(x + r, y);
              accentPath.arc(x, y, r, 0, Math.PI * 2);
              continue;
            }
          }
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      if (accentPath) {
        ctx.fillStyle = accent;
        ctx.fill(accentPath);
      }
    };

    const loop = (now) => {
      // Ease the hover reveal.
      const target = pointer.hovering ? 1 : 0;
      pointer.inside += (target - pointer.inside) * 0.08;
      draw(now);
      if (running && !(reduce && Math.abs(target - pointer.inside) < 0.01)) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onDown = (e) => {
      if (e.pointerType === "mouse") return;
      pointer.hovering = !pointer.hovering;
      if (!pointer.hovering) { pointer.x = -1e4; pointer.y = -1e4; }
      start();
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.hovering = true;
      start();
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
      pointer.hovering = false;
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) start();
      else stop();
    });
    const onVis = () => (document.hidden ? stop() : start());
    const mo = new MutationObserver(() => {
      refreshColors();
      draw(performance.now());
    });

    img.onload = () => {
      refreshColors();
      resize();
      io.observe(canvas);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src, reduce, focus.x, focus.y, zoom]);

  return <canvas ref={canvasRef} role="img" aria-label={alt} className={`block h-full w-full ${className}`} />;
}
