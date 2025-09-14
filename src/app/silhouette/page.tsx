"use client";

import DailyProgress from "@/components/DailyProgress";
import GameMessage from "@/components/GameMessage";
import InfoDialog from "@/components/InfoDialog";
import SearchBar from "@/components/SearchBar";
import GuessResults from "@/components/GuessResults";
import SilhouetteImage from "@/components/SilhouetteImage";
import { useDaily } from "@/components/DailyProvider";
import { getFootballerById } from "@/lib/data";
import type { Footballer } from "@/types/database";
import { useCallback, useEffect, useRef, useState } from "react";
import Success from "@/components/Success";
import { readJson, writeJson, storageKeys } from "@/utils/storage";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SilhouettePage() {
  const { challenges, setProgress } = useDaily();
  const silhouetteId = challenges?.silhouette ?? null;
  const [target, setTarget] = useState<Footballer | null>(null);
  const [rows, setRows] = useState<React.ComponentProps<typeof GuessResults>["rows"]>([]);
  const [solved, setSolved] = useState(false);
  const [brightnessLevel, setBrightnessLevel] = useState(0.4); // Start very dark
  const [countryRevealed, setCountryRevealed] = useState(false);
  const [clubRevealed, setClubRevealed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      console.log("[Silhouette] silhouetteId:", silhouetteId);
      if (!silhouetteId) return;
      const data = await getFootballerById(silhouetteId);
      console.log("[Silhouette] Loaded footballer:", data);
      if (active) setTarget(data);
    })();
    return () => { active = false; };
  }, [silhouetteId]);

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
        console.log("[Silhouette] Hint images preloaded");
      } catch (error) {
        console.warn("[Silhouette] Some hint images failed to preload:", error);
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
    }>(storageKeys.silhouetteSession);
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
    console.groupCollapsed("[Footle][Silhouette] evaluateGuess", { guessId: guess.id, guessName: guess.fullname });
    try {
      // For silhouette mode, we only need to track if it's correct or not
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
      }>(storageKeys.silhouetteSession) ?? { 
        guesses: [], 
        countryRevealed: false, 
        clubRevealed: false 
      };
      if (!existing.guesses.includes(guess.id)) {
        writeJson(storageKeys.silhouetteSession, { 
          guesses: [...existing.guesses, guess.id],
          countryRevealed: existing.countryRevealed,
          clubRevealed: existing.clubRevealed
        });
      }

      // Update brightness level - make it brighter with each wrong guess
      if (!isCorrect) {
        setBrightnessLevel(prev => Math.min(1, prev + 0.08)); // Increase brightness by 8% each wrong guess
      }

      // solved?
      if (isCorrect) {
        setSolved(true);
        setProgress((prev) => ({ ...prev, silhouette: "solved" }));
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
    }>(storageKeys.silhouetteSession) ?? { 
      guesses: [], 
      countryRevealed: false, 
      clubRevealed: false 
    };
    writeJson(storageKeys.silhouetteSession, { 
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
    }>(storageKeys.silhouetteSession) ?? { 
      guesses: [], 
      countryRevealed: false, 
      clubRevealed: false 
    };
    writeJson(storageKeys.silhouetteSession, { 
      ...existing,
      clubRevealed: true
    });
  }, []);

  const onShare = useCallback(() => {
    const lines = rows.map((r) => {
      return r.footballer.fullname;
    });
    const header = `Footle Silhouette ${solved ? rows.length : 'X'}/${"?"}`;
    const url = typeof window !== "undefined" ? window.location.origin + "/silhouette" : "footle";
    const text = `${header}\n${lines.join("\n")}\n${url}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [rows, solved]);

  const wrongGuesses = rows.length;

  return (
    <div className="flex flex-col items-center min-h-[60vh] px-2">
      <div className="w-full">
        <DailyProgress />
      </div>
      <GameMessage title="Silhouette Mode" subtitle="Guess the footballer from their silhouette">
        <InfoDialog title="How Silhouette Works">
          <ul className="list-disc ml-5 space-y-1">
            <li>Guess the daily footballer from their black silhouette.</li>
            <li>The image becomes brighter with each wrong guess.</li>
            <li>Get hints: country after 3 guesses, club after 6 guesses.</li>
            <li>Only see avatar and name for your guesses.</li>
            <li>Your progress is saved locally and resets daily.</li>
          </ul>
        </InfoDialog>
      </GameMessage>

      {!solved && target ? (
        <div className="w-full max-w-md mb-6">
          <div className="bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg p-6 text-center">
            <h2 className="text-white text-xl mb-4">Can you guess the footballer?</h2>
            <SilhouetteImage
              src={target.avatar}
              alt="Silhouette footballer"
              width={200}
              height={200}
              brightnessLevel={brightnessLevel}
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
                        disabled={wrongGuesses < 3}
                        className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                        size="sm"
                      >
                        {wrongGuesses >= 3 ? "Reveal!" : `${3 - wrongGuesses} more guess${3 - wrongGuesses !== 1 ? 'es' : ''}`}
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
                        disabled={wrongGuesses < 6}
                        className="bg-[#f0d36c] hover:bg-[#f0d36c]/80 text-black text-xs px-3 py-1 h-auto disabled:opacity-50"
                        size="sm"
                      >
                        {wrongGuesses >= 6 ? "Reveal!" : `${6 - wrongGuesses} more guess${6 - wrongGuesses !== 1 ? 'es' : ''}`}
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
              Loading today's silhouette challenge...
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
            excludeIds={(readJson<{ guesses: number[] }>(storageKeys.silhouetteSession)?.guesses) ?? []}
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
          <Success attempts={rows.length} target={target} mode="silhouette" onShare={onShare} />
          <Realistic autorun={{ speed: 0.8, duration: 1000 }} />
        </div>
      ) : null}
    </div>
  );
}
