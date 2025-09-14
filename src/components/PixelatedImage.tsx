"use client";

import React, { useEffect, useRef } from "react";

type PixelatedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  pixelationLevel: number; // 0-1, where 0 is most pixelated, 1 is clear
  className?: string;
};

export default function PixelatedImage({ 
  src, 
  alt, 
  width, 
  height, 
  pixelationLevel, 
  className = "" 
}: PixelatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    // Intentionally do not set crossOrigin to avoid blocking load when server lacks CORS headers
    img.onload = () => {
      // Calculate pixelation scale
      // Higher pixelation level = less pixelated (more clear)
      // Scale from 0.02 (very pixelated) to 0.3 (slightly pixelated)
      const scale = 0.02 + (pixelationLevel * 0.28);
      const smallW = Math.max(1, Math.floor(width * scale));
      const smallH = Math.max(1, Math.floor(height * scale));

      canvas.width = width;
      canvas.height = height;

      // Turn off smoothing for crisp pixels
      ctx.imageSmoothingEnabled = false;

      // Clear before drawing
      ctx.clearRect(0, 0, width, height);

      // Use an offscreen canvas to avoid leaving the small version in the corner
      const offscreen = document.createElement("canvas");
      offscreen.width = smallW;
      offscreen.height = smallH;
      const octx = offscreen.getContext("2d");
      if (!octx) return;
      octx.imageSmoothingEnabled = false;
      // Step 1: draw the tiny image onto offscreen buffer
      octx.drawImage(img, 0, 0, smallW, smallH);
      // Step 2: draw the offscreen buffer scaled up to the main canvas
      ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, width, height);
    };

    img.onerror = () => {
      // Draw a simple placeholder if the image fails to load
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(alt || "Image", width / 2, height / 2);
    };

    img.src = src;
  }, [src, width, height, pixelationLevel]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
}
