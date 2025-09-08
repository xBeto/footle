"use client";

import { useEffect, useRef } from "react";

type SuccessProps = {
  attempts: number;
  onShare?: () => void;
};

export default function Success({ attempts, onShare }: SuccessProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lightweight confetti-like effect without external deps
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const pieces: HTMLDivElement[] = [];
    const colors = ["#f0d36c", "#34d399", "#60a5fa", "#f472b6", "#f97316"]; 
    for (let i = 0; i < 40; i += 1) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.top = "-10px";
      el.style.left = `${Math.random() * 100}%`;
      el.style.width = `6px`;
      el.style.height = `12px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = "0.9";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.borderRadius = "2px";
      el.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
      container.appendChild(el);
      pieces.push(el);
    }
    const css = document.createElement("style");
    css.innerHTML = `@keyframes fall { to { transform: translateY(140%) rotate(360deg); opacity: 0.2; } }`;
    document.head.appendChild(css);
    const t = setTimeout(() => {
      pieces.forEach((p) => p.remove());
      css.remove();
    }, 5000);
    return () => { clearTimeout(t); pieces.forEach((p) => p.remove()); css.remove(); };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <div className="rounded-lg border border-emerald-500 bg-emerald-600/20 text-white px-4 py-4 text-center">
        <div className="text-xl font-semibold">You got it!</div>
        <div className="text-white/90 mt-1">Solved in {attempts} {attempts === 1 ? "try" : "tries"}.</div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button type="button" onClick={onShare} className="px-3 py-2 rounded-md bg-[#f0d36c] text-black font-medium">Share</button>
        </div>
      </div>
    </div>
  );
}


