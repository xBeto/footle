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

export default function PixelPage() {
  const { challenges, setProgress } = useDaily();
  const pixelId = challenges?.pixel ?? null;
  const [target, setTarget] = useState<Footballer | null>(null);
  const [rows, setRows] = useState<React.ComponentProps<typeof GuessResults>["rows"]>([]);
  const [solved, setSolved] = useState(false);
  const [pixelationLevel, setPixelationLevel] = useState(0.1); // Start very pixelated
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

  // Restore from storage when target ready
  useEffect(() => {
    if (!target) return;
    const saved = readJson<{ guesses: number[] }>(storageKeys.pixelSession);
    if (!saved || !saved.guesses?.length) return;
    (async () => {
      const restored: Footballer[] = [];
      for (const id of saved.guesses) {
        const f = await getFootballerById(id);
        if (f) restored.push(f);
      }
      restored.forEach((g) => evaluateGuess(g));
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
      const existing = readJson<{ guesses: number[] }>(storageKeys.pixelSession) ?? { guesses: [] };
      if (!existing.guesses.includes(guess.id)) {
        writeJson(storageKeys.pixelSession, { guesses: [...existing.guesses, guess.id] });
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

      {solved ? (
        <div className="mt-6 w-full" ref={successRef}>
          <Realistic autorun={{ speed: 0.8, duration: 2000 }} />
          <Success attempts={rows.length} onShare={onShare} />
        </div>
      ) : null}
    </div>
  );
}
