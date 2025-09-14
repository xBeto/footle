"use client";

import DailyProgress from "@/components/DailyProgress";
import GameMessage from "@/components/GameMessage";
import InfoDialog from "@/components/InfoDialog";
import SearchBar from "@/components/SearchBar";
import GuessResults from "@/components/GuessResults";
import PixelatedImage from "@/components/PixelatedImage";
import { useDaily } from "@/components/DailyProvider";
import { getFootballerById } from "@/lib/data";
import type { Footballer } from "@/types/database";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Success from "@/components/Success";
import { readJson, writeJson, storageKeys } from "@/utils/storage";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PixelPage() {
  const { challenges, setProgress } = useDaily();
  const pixelId = challenges?.pixel ?? null;
  const [target, setTarget] = useState<Footballer | null>(null);
  const [rows, setRows] = useState<React.ComponentProps<typeof GuessResults>["rows"]>([]);
  const [solved, setSolved] = useState(false);
  const [pixelationLevel, setPixelationLevel] = useState(0.1); // Start very pixelated
  const [countryRevealed, setCountryRevealed] = useState(false);
  const [clubRevealed, setClubRevealed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!pixelId) return;
      const data = await getFootballerById(pixelId);
      if (active) setTarget(data);
    })();
    return () => { active = false; };
  }, [pixelId]);

  // Preload hint images when target is loaded
  useEffect(() => {
    if (!target) return;
    
    const preloadImages = async () => {
      const imagePromises = [];
      
      // Preload country flag
      if (target.nationality) {
        const countryImg = new window.Image();
        countryImg.src = target.nationality;
        imagePromises.push(new Promise((resolve, reject) => {
          countryImg.onload = resolve;
          countryImg.onerror = reject;
        }));
      }
      
      // Preload club logo
      if (target.club) {
        const clubImg = new window.Image();
        clubImg.src = target.club;
        imagePromises.push(new Promise((resolve, reject) => {
          clubImg.onload = resolve;
          clubImg.onerror = reject;
        }));
      }
      
      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
        console.log("[Pixel] Hint images preloaded");
      } catch (error) {
        console.warn("[Pixel] Some hint images failed to preload:", error);
        setImagesLoaded(true); // Still set to true to show the UI
      }
    };
    
    preloadImages();
  }, [target]);

  // Restore from storage when target ready
  useEffect(() => {
    if (!target) return;
    const saved = readJson<{ 
      guesses: number[]; 
      countryRevealed: boolean; 
      clubRevealed: boolean; 
    }>(storageKeys.pixelSession);
    if (!saved || !saved.guesses?.length) return;
    (async () => {
      const restored: Footballer[] = [];
      for (const id of saved.guesses) {
        const f = await getFootballerById(id);
        if (f) restored.push(f);
      }
      restored.forEach((g) => evaluateGuess(g));
      setCountryRevealed(saved.countryRevealed || false);
      setClubRevealed(saved.clubRevealed || false);
    })();
  }, [target]);

  const evaluateGuess = useCallback((guess: Footballer) => {
    if (!target) return;
    console.groupCollapsed("[Footle][Pixel] evaluateGuess", { guessId: guess.id, guessName: guess.fullname });
    try {
      // For pixel mode, we only need to track if it's correct or not
      const isCorrect = guess.id === target.id;
      
      setRows((prev) => {
        const nextRow = {
          footballer: { id: guess.id, fullname: guess.fullname, avatar: guess.avatar },
          cells: {
            position: { value: guess.position, color: "red" as const },
            nationality: { value: guess.nationality, color: "red" as const },
            club: { value: guess.club, color: "red" as const },
            league: { value: guess.league, color: "red" as const },
            rating: { value: guess.rating, color: "red" as const },
            age: { value: new Date().getFullYear() - new Date(guess.birthdate).getFullYear(), color: "red" as const },
          },
        } as const;
        const next = [nextRow, ...prev];
        return next;
      });

      // persist ids
      const existing = readJson<{ 
        guesses: number[]; 
        countryRevealed: boolean; 
        clubRevealed: boolean; 
      }>(storageKeys.pixelSession) ?? { 
        guesses: [], 
        countryRevealed: false, 
        clubRevealed: false 
      };
      if (!existing.guesses.includes(guess.id)) {
        writeJson(storageKeys.pixelSession, { 
          guesses: [...existing.guesses, guess.id],
          countryRevealed: existing.countryRevealed,
          clubRevealed: existing.clubRevealed
        });
      }

      // Update pixelation level - make it clearer with each wrong guess
      if (!isCorrect) {
        setPixelationLevel(prev => Math.min(1, prev + 0.2)); // Increase clarity by 20% each wrong guess
      }

      // solved?
      if (isCorrect) {
        setSolved(true);
        setProgress((prev) => ({ ...prev, pixel: "solved" }));
      }
    } finally {
      console.groupEnd();
    }
  }, [target, setProgress]);

  // Scroll to success banner on solve
  useEffect(() => {
    if (solved) {
      const el = successRef.current;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [solved]);

  const handleSearchSelect = useCallback(async (picked: Pick<Footballer, "id" | "fullname" | "avatar">) => {
    const full = await getFootballerById(picked.id);
    if (full) {
      evaluateGuess(full);
    }
  }, [evaluateGuess]);

  const handleRevealCountry = useCallback(() => {
    setCountryRevealed(true);
    const existing = readJson<{ 
      guesses: number[]; 
      countryRevealed: boolean; 
      clubRevealed: boolean; 
    }>(storageKeys.pixelSession) ?? { 
      guesses: [], 
      countryRevealed: false, 
      clubRevealed: false 
    };
    writeJson(storageKeys.pixelSession, { 
      ...existing,
      countryRevealed: true
    });
  }, []);

  const handleRevealClub = useCallback(() => {
    setClubRevealed(true);
    const existing = readJson<{ 
      guesses: number[]; 
      countryRevealed: boolean; 
      clubRevealed: boolean; 
    }>(storageKeys.pixelSession) ?? { 
      guesses: [], 
      countryRevealed: false, 
      clubRevealed: false 
    };
    writeJson(storageKeys.pixelSession, { 
      ...existing,
      clubRevealed: true
    });
  }, []);

  const onShare = useCallback(() => {
    const lines = rows.map((r) => {
      return r.footballer.fullname;
    });
    const header = `Footle Pixel ${solved ? rows.length : 'X'}/${"?"}`;
    const url = typeof window !== "undefined" ? window.location.origin + "/pixel" : "footle";
    const text = `${header}\n${lines.join("\n")}\n${url}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [rows, solved]);

  return (
    <div className="flex flex-col items-center min-h-[60vh] px-2">
      <div className="w-full">
        <DailyProgress />
      </div>
      <GameMessage title="Pixel Mode" subtitle="Guess the footballer from a pixelated image">
        <InfoDialog title="How Pixel Works">
          <ul className="list-disc ml-5 space-y-1">
            <li>Guess the daily footballer from a pixelated image.</li>
            <li>The image becomes clearer with each wrong guess.</li>
            <li>Only see avatar and name for your guesses.</li>
            <li>Your progress is saved locally and resets daily.</li>
          </ul>
        </InfoDialog>
      </GameMessage>

      {!solved && target ? (
        <div className="w-full max-w-md mb-6">
          <div className="bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg p-6 text-center">
            <h2 className="text-white text-xl mb-4">Can you guess the footballer?</h2>
            <PixelatedImage
              src={target.avatar}
              alt="Pixelated footballer"
              width={200}
              height={200}
              pixelationLevel={pixelationLevel}
              className="mx-auto"
            />
            
            {/* Hints section inside the same div */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <h3 className="text-white text-sm font-semibold">💡 Receive Hints!</h3>
              <div className="space-y-1.5">
                {/* Country Hint */}
                <div className="flex items-center justify-center gap-3 h-10">
                  <div className="text-white/80 text-sm">
                    Country:
                  </div>
                  {countryRevealed ? (
                    <div className="flex items-center gap-2">
                      <div className="relative w-12 h-10">
                        <Image
                          src={`${target.nationality}`}
                          alt={target.nationality}
                          fill
                          className="object-cover rounded-sm"
                          unoptimized
                          draggable={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleRevealCountry}
                        disabled={rows.length < 3}
                        className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                        size="sm"
                      >
                        {rows.length >= 3 ? "Reveal!" : `${3 - rows.length} more guess${3 - rows.length !== 1 ? 'es' : ''}`}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Club Hint */}
                <div className="flex items-center justify-center gap-3 h-10">
                  <div className="text-white/80 text-sm">
                    Club:
                  </div>
                  {clubRevealed ? (
                    <div className="flex items-center gap-2">
                      <div className="relative w-12 h-10">
                        <Image
                          src={target.club}
                          alt={target.club}
                          fill
                          className="object-contain"
                          unoptimized
                          draggable={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleRevealClub}
                        disabled={rows.length < 6}
                        className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                        size="sm"
                      >
                        {rows.length >= 6 ? "Reveal!" : `${6 - rows.length} more guess${6 - rows.length !== 1 ? 'es' : ''}`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !solved && !target ? (
        <div className="w-full max-w-md mb-6">
          <div className="bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg p-6 text-center">
            <p className="text-white/90 text-sm">
              Loading today's pixel challenge...
            </p>
          </div>
        </div>
      ) : null}

      {!solved ? (
        <div className="w-full max-w-2xl mb-6">
          <SearchBar
            onSelect={handleSearchSelect}
            placeholder="Search any footballer..."
            buttonLabel="Guess"
            excludeIds={(readJson<{ guesses: number[] }>(storageKeys.pixelSession)?.guesses) ?? []}
          />
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="w-full">
          <GuessResults rows={rows} variant="simple" />
        </div>
      ) : null}

      {solved && target ? (
        <div className="mt-6 w-full" ref={successRef}>
          <Realistic autorun={{ speed: 0.8, duration: 2000 }} />
          <Success attempts={rows.length} target={target} mode="pixel" onShare={onShare} />
        </div>
      ) : null}
    </div>
  );
}
