"use client";

import React from "react";
import Image from "next/image";

type SilhouetteImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  brightnessLevel: number; // 0-1, where 0 is completely black, 1 is normal
  className?: string;
};

export default function SilhouetteImage({ 
  src, 
  alt, 
  width, 
  height, 
  brightnessLevel, 
  className = "" 
}: SilhouetteImageProps) {
  // Calculate the brightness and contrast values
  // brightnessLevel 0 = completely black silhouette
  // brightnessLevel 1 = normal image
  const brightness = Math.max(0, Math.min(100, brightnessLevel * 100));
  const contrast = brightnessLevel < 0.1 ? 1000 : Math.max(100, 1000 - (brightnessLevel * 900));
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ 
          filter: `grayscale(100%) brightness(${brightness}%) contrast(${contrast}%)`,
          imageRendering: "pixelated"
        }}
        unoptimized
      />
    </div>
  );
}
