"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SilhouetteHintsProps = {
  wrongGuesses: number;
  country: string;
  club: string;
  countryFlag: string;
  clubLogo: string;
  onRevealCountry: () => void;
  onRevealClub: () => void;
  countryRevealed: boolean;
  clubRevealed: boolean;
};

export default function SilhouetteHints({
  wrongGuesses,
  country,
  club,
  countryFlag,
  clubLogo,
  onRevealCountry,
  onRevealClub,
  countryRevealed,
  clubRevealed,
}: SilhouetteHintsProps) {
  const canRevealCountry = wrongGuesses >= 3 && !countryRevealed;
  const canRevealClub = wrongGuesses >= 6 && !clubRevealed;
  const countryGuessesLeft = Math.max(0, 3 - wrongGuesses);
  const clubGuessesLeft = Math.max(0, 6 - wrongGuesses);

  return (
    <div className="w-full max-w-md mb-6">
      <div className="bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg p-4">
        <h3 className="text-white text-lg font-semibold mb-4 text-center">💡 Hints</h3>
        <div className="space-y-4">
          {/* Country Hint */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-white/80 text-sm font-medium">
                🌍 Country:
              </div>
              {countryRevealed ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-4">
                    <Image
                      src={countryFlag}
                      alt={country}
                      fill
                      className="object-cover rounded-sm"
                      unoptimized
                    />
                  </div>
                  <span className="text-[#f0d36c] font-medium text-sm">{country}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-gray-700 rounded-sm flex items-center justify-center">
                    <span className="text-gray-400 text-xs">?</span>
                  </div>
                  <Button
                    onClick={onRevealCountry}
                    disabled={!canRevealCountry}
                    className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                    size="sm"
                  >
                    {canRevealCountry ? "Reveal!" : `${countryGuessesLeft} more guess${countryGuessesLeft !== 1 ? 'es' : ''}`}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Club Hint */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-white/80 text-sm font-medium">
                ⚽ Club:
              </div>
              {clubRevealed ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={clubLogo}
                      alt={club}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-[#f0d36c] font-medium text-sm">{club}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-sm flex items-center justify-center">
                    <span className="text-gray-400 text-xs">?</span>
                  </div>
                  <Button
                    onClick={onRevealClub}
                    disabled={!canRevealClub}
                    className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                    size="sm"
                  >
                    {canRevealClub ? "Reveal!" : `${clubGuessesLeft} more guess${clubGuessesLeft !== 1 ? 'es' : ''}`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
