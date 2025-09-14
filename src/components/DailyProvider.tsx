"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resetIfNewDay, readJson, writeJson, storageKeys } from "@/utils/storage";
import { getDailyChallenges } from "@/lib/data";

type ModeKey = "classic" | "pixel" | "silhouette";

type ChallengesByMode = Partial<Record<ModeKey, number>>; // footballerId per mode

type ProgressState = Partial<Record<ModeKey, "playing" | "solved">>;

type DailyContextValue = {
  challenges: ChallengesByMode | null;
  progress: ProgressState;
  setProgress: (updater: (prev: ProgressState) => ProgressState) => void;
  refreshDaily: () => Promise<void>;
};

const DailyContext = createContext<DailyContextValue | undefined>(undefined);

export function DailyProvider({ children }: { children: React.ReactNode }) {
  const [challenges, setChallenges] = useState<ChallengesByMode | null>(null);
  const [progress, setProgressState] = useState<ProgressState>(() => readJson<ProgressState>(storageKeys.progress) ?? {});

  const setProgress = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setProgressState((prev) => {
      const next = updater(prev);
      writeJson(storageKeys.progress, next as any);
      return next;
    });
  }, []);

  const loadDaily = useCallback(async () => {
    try {
      // Try cached challenges first
      const cached = readJson<ChallengesByMode>(storageKeys.dailyChallenges);
      if (cached) {
        setChallenges(cached);
      }
      const list = await getDailyChallenges();
      console.log("[DailyProvider] Raw challenges:", list);
      const mapped: ChallengesByMode = {};
      for (const item of list) {
        // Mode ids mapping: 1=classic, 2=pixel, 3=silhouette (temporarily using 3 for silhouette)
        if (item.mode_id === 1) mapped.classic = item.footballer_id;
        if (item.mode_id === 2) mapped.pixel = item.footballer_id;
        if (item.mode_id === 3) mapped.silhouette = item.footballer_id;
      }
      console.log("[DailyProvider] Mapped challenges:", mapped);
      setChallenges(mapped);
      writeJson(storageKeys.dailyChallenges, mapped as any);
    } catch (err) {
      // Keep cached if available
      console.error("Failed to load daily challenges", err);
    }
  }, []);

  const refreshDaily = useCallback(async () => {
    await loadDaily();
  }, [loadDaily]);

  useEffect(() => {
    const purged = resetIfNewDay();
    if (purged) {
      setChallenges(null);
      setProgressState({});
    }
    loadDaily();
  }, [loadDaily]);

  const value = useMemo<DailyContextValue>(() => ({ challenges, progress, setProgress, refreshDaily }), [challenges, progress, setProgress, refreshDaily]);

  return <DailyContext.Provider value={value}>{children}</DailyContext.Provider>;
}

export function useDaily() {
  const ctx = useContext(DailyContext);
  if (!ctx) throw new Error("useDaily must be used within DailyProvider");
  return ctx;
}


