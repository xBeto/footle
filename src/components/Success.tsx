"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Footballer } from "@/types/database";

type SuccessProps = {
  attempts: number;
  target: Footballer;
  mode: "classic" | "pixel" | "silhouette";
  onShare?: () => void;
};

export default function Success({ attempts, target, mode, onShare }: SuccessProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Get next UTC midnight (much simpler)
      const nextMidnight = new Date(now);
      nextMidnight.setUTCDate(now.getUTCDate() + 1);
      nextMidnight.setUTCHours(0, 0, 0, 0);
      
      const diff = nextMidnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("New daily available!");
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const [shareText, setShareText] = useState("");

  useEffect(() => {
    if (mode === "classic" && onShare) {
      // For classic mode, we need to get the actual content from the onShare function
      // We'll create a temporary function to capture what gets copied
      const originalClipboard = navigator.clipboard?.writeText;
      let capturedText = "";
      
      // Temporarily override clipboard to capture the text
      if (navigator.clipboard) {
        navigator.clipboard.writeText = (text: string) => {
          capturedText = text;
          return Promise.resolve();
        };
        
        // Call the original onShare to capture the text
        onShare();
        
        // Restore original clipboard function
        navigator.clipboard.writeText = originalClipboard!;
        
        setShareText(capturedText);
      }
    } else {
      // Pixel and Silhouette modes use simple format
      const url = typeof window !== "undefined" ? window.location.origin : "footle.xyz";
      const text = `I found #Footle footballer #${target.id} in ${mode} mode in ${attempts} shots ⚽\n\n${target.fullname}\n\n${url}`;
      setShareText(text);
    }
  }, [mode, onShare, target.id, target.fullname, attempts]);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        console.log("Copied to clipboard!");
      }).catch(() => {});
    }
  };

  const handleNativeShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "footle.xyz";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Footle - Football Guessing Game",
          text: shareText,
          url: url
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback to copy if native sharing is not available
      handleCopy();
    }
  };

  const getNextModeInfo = () => {
    // Mode cycling: Classic (0) → Pixel (1) → Silhouette (2) → Classic (0)
    switch (mode) {
      case "classic":
        return { name: "Pixel", icon: "/PixelLogo.png", href: "/pixel" };
      case "pixel":
        return { name: "Silhouette", icon: "/SilhouetteLogo.png", href: "/silhouette" };
      case "silhouette":
        return { name: "Classic", icon: "/ClassicLogo.png", href: "/classic" };
      default:
        return { name: "Pixel", icon: "/PixelLogo.png", href: "/pixel" };
    }
  };

  const nextModeInfo = getNextModeInfo();

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="rounded-lg border border-[#17d419]/30 bg-[#17d419]/50 text-white px-6 py-6 text-center">
        <div className="text-2xl font-bold mb-2">You guessed correctly!</div>
        
        {/* Large Avatar */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <Image
              src={target.avatar}
              alt={target.fullname}
              fill
              className="object-cover"
              sizes="8rem"
              priority
            />
          </div>
        </div>
        
        <div className="text-white/90 mt-4 text-xl font-semibold">
          {target.fullname}
        </div>
        
        <div className="text-white/80 mt-2">
          Number of tries: {attempts}
        </div>
        
        <div className="p-4">
          <div className="text-white/90 text-sm mb-2">Next daily in</div>
          <div className="text-4xl font-mono font-bold text-[#f0d36c]">
            {timeLeft}
          </div>
          <div className="text-white/70 text-xs mt-1">
            Midnight in Europe UTC
          </div>
        </div>
        
        <Link href={nextModeInfo.href} className="block p-4">
          <div className="text-white/90 text-sm mb-2">Next mode:</div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-16 h-16">
              <Image
                src={nextModeInfo.icon}
                alt={nextModeInfo.name}
                fill
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
            <div className="text-white font-medium">
              {nextModeInfo.name} guessing
            </div>
          </div>
          <div className="text-white/80 text-xs mt-2">
            Press the icon to proceed
          </div>
        </Link>
        
        {/* Share Preview */}
        <div className="p-4">
          <div className="text-white text-lg">Share:</div>
          <div className="text-white font-mono whitespace-pre-wrap break-words">
            {shareText}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="px-6 py-3 rounded-md bg-white/20 text-white font-bold hover:bg-white/30 transition-colors duration-200"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="px-6 py-3 rounded-md bg-[#f0d36c] text-black font-bold hover:bg-[#f0d36c]/90 transition-colors duration-200"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}