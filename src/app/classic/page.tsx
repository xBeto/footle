"use client";

import DailyProgress from "@/components/DailyProgress";
import GameMessage from "@/components/GameMessage";
import InfoDialog from "@/components/InfoDialog";
import SearchBar from "@/components/SearchBar";
import GuessResults from "@/components/GuessResults";
import { useDaily } from "@/components/DailyProvider";
import { getFootballerById } from "@/lib/data";
import type { Footballer } from "@/types/database";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Success from "@/components/Success";
import { readJson, writeJson, storageKeys } from "@/utils/storage";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

export default function ClassicPage() {
  const { challenges, setProgress } = useDaily();
  const classicId = challenges?.classic ?? null;
  const [target, setTarget] = useState<Footballer | null>(null);
  const [rows, setRows] = useState<React.ComponentProps<typeof GuessResults>["rows"]>([]);
  const [solved, setSolved] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!classicId) return;
      const data = await getFootballerById(classicId);
      if (active) setTarget(data);
    })();
    return () => { active = false; };
  }, [classicId]);

  // Restore from storage when target ready
  useEffect(() => {
    if (!target) return;
    const saved = readJson<{ guesses: number[] }>(storageKeys.classicSession);
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
    console.groupCollapsed("[Footle][Classic] evaluateGuess", { guessId: guess.id, guessName: guess.fullname });
    try {

      const now = new Date();
      const birthYearTarget = new Date(target.birthdate).getFullYear();
      const birthYearGuess = new Date(guess.birthdate).getFullYear();
      const ageTarget = now.getFullYear() - birthYearTarget;
      const ageGuess = now.getFullYear() - birthYearGuess;
      const ratingDiff = guess.rating - target.rating;
      const ageDiff = ageGuess - ageTarget;
      const withinOne = (n: number) => Math.abs(n) === 1;

      const colorFor = (match: boolean, close: boolean): "green" | "orange" | "red" => match ? "green" : close ? "orange" : "red";

      setRows((prev) => {
        const nextRow = {
          footballer: { id: guess.id, fullname: guess.fullname, avatar: guess.avatar },
          cells: {
            position: { value: guess.position, color: colorFor(guess.position === target.position, false) },
            nationality: { value: guess.nationality, color: colorFor(guess.nationality === target.nationality, false) },
            club: { value: guess.club, color: colorFor(guess.club === target.club, false) },
            league: { value: guess.league, color: colorFor(guess.league === target.league, false) },
            rating: {
              value: guess.rating,
              color: colorFor(guess.rating === target.rating, withinOne(ratingDiff)),
              arrow: guess.rating === target.rating ? undefined : ratingDiff < 0 ? "up" : "down",
            },
            age: {
              value: ageGuess,
              color: colorFor(ageGuess === ageTarget, withinOne(ageDiff)),
              arrow: ageGuess === ageTarget ? undefined : ageDiff < 0 ? "up" : "down",
            },
          },
        } as const;
        const next = [nextRow, ...prev];
        return next;
      });

      // persist ids
      const existing = readJson<{ guesses: number[] }>(storageKeys.classicSession) ?? { guesses: [] };
      if (!existing.guesses.includes(guess.id)) {
        writeJson(storageKeys.classicSession, { guesses: [...existing.guesses, guess.id] });
      }

      // solved?
      const isSolved = (
        guess.position === target.position &&
        guess.nationality === target.nationality &&
        guess.club === target.club &&
        guess.league === target.league &&
        guess.rating === target.rating &&
        (new Date().getFullYear() - new Date(guess.birthdate).getFullYear()) === (new Date().getFullYear() - new Date(target.birthdate).getFullYear())
      );
      if (isSolved) {
        setSolved(true);
        setProgress((prev) => ({ ...prev, classic: "solved" }));
      }
    } finally {
      console.groupEnd();
    }
  }, [target]);

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
    const toEmoji = (color: "green" | "orange" | "red") => (color === "green" ? "🟩" : color === "orange" ? "🟧" : "🟥");
    const lines = rows.map((r) => {
      const order: (keyof typeof r.cells)[] = ["position", "nationality", "club", "league", "rating", "age"];
      return order.map((k) => toEmoji(r.cells[k].color)).join("");
    });
    const header = `Footle Classic solved in ${rows.length} tries`;
    const url = typeof window !== "undefined" ? window.location.origin + "/classic" : "footle";
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
      <GameMessage title="Classic Mode" subtitle="Guess the footballer, get a clue each try">
        <InfoDialog title="How Classic Works">
          <ul className="list-disc ml-5 space-y-1">
            <li>Guess the daily footballer. New puzzle every day.</li>
            <li>Each guess reveals hints across columns.</li>
            <li>Colors: Green = correct, Orange = numbers ±1 (with arrow), Red = incorrect.</li>
            <li>Your progress is saved locally and resets daily.</li>
          </ul>
        </InfoDialog>
      </GameMessage>

      {!solved ? (
        <div className="w-full max-w-2xl mb-6">
          <SearchBar
            onSelect={handleSearchSelect}
            placeholder="Search any footballer..."
            buttonLabel="Guess"
            excludeIds={(readJson<{ guesses: number[] }>(storageKeys.classicSession)?.guesses) ?? []}
          />
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="w-full">
          <GuessResults rows={rows} variant="advanced" />
        </div>
      ) : null}

      {solved && target ? (
        <div className="mt-6 w-full" ref={successRef}>
          <Realistic autorun={{ speed: 0.8, duration: 2000 }} />
          <Success attempts={rows.length} target={target} mode="classic" onShare={onShare} />
        </div>
      ) : null}
    </div>
  );
}