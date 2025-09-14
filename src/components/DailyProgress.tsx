"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDaily } from "@/components/DailyProvider";
import { useEffect, useState } from "react";

type ModeConfig = {
  key: "classic" | "pixel" | "silhouette";
  name: string;
  href: string;
  iconSrc: string;
};

const MODES: ModeConfig[] = [
  { key: "classic", name: "Classic", href: "/classic", iconSrc: "/ClassicLogo.png" },
  { key: "pixel", name: "Pixel", href: "/pixel", iconSrc: "/PixelLogo.png" },
  { key: "silhouette", name: "Silhouette", href: "/silhouette", iconSrc: "/SilhouetteLogo.png" },
];

export function DailyProgress() {
  const pathname = usePathname();
  const { progress } = useDaily();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const completed = mounted ? MODES.reduce((acc, m) => acc + (progress[m.key] === "solved" ? 1 : 0), 0) : 0;
  const total = MODES.length;
  const percent = mounted ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full sm:w-3/5 md:w-2/5 mx-auto">
      <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 mb-4 text-white/90">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-semibold">Daily Progress</h3>
          <span className="text-sm text-white/70">{mounted ? `${completed} OF ${total} completed` : `— OF ${total} completed`}</span>
        </div>

        <div className="flex items-center gap-10 justify-center py-2">
          {MODES.map((mode) => {
            const isActive = pathname === mode.href;
            const isCompleted = mounted && progress[mode.key] === "solved";
            return (
              <div key={mode.key} className="flex flex-col items-center min-w-16">
                <Link href={mode.href} className={`p-2 ${isActive || isCompleted ? "" : "hover:scale-105 transition-transform duration-200 opacity-50"}`}>
                  <div className="relative">
                    <Image
                      src={mode.iconSrc}
                      alt={mode.name}
                      width={56}
                      height={56}
                      className={`w-14 h-14 ${isActive ? "scale-120" : "hover:scale-105 transition-transform duration-200"}`}
                      sizes="56px"
                      priority={mode.key === "classic"}
                    />
                    {isCompleted && (
                      <div className="absolute -top-2.5 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
                <span className="mt-2 text-xs text-center">{mode.name}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#f0d36c]" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyProgress;


