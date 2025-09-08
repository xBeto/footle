"use client";

import React from "react";

type GameMessageProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // actions / extras row
};

export default function GameMessage({ title, subtitle, children }: GameMessageProps) {
  return (
    <div className="text-center w-full">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-lg sm:text-xl text-white/80 mb-6 max-w-2xl mx-auto">
          {subtitle}
        </p>
      ) : null}
      {children ? (
        <div className="flex items-center justify-center gap-3 mb-6">
          {children}
        </div>
      ) : null}
    </div>
  );
}


