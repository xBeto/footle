"use client";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const STORAGE_PREFIX = "footle";
const LAST_DATE_KEY = `${STORAGE_PREFIX}:lastDate`;

// Keys that are safe to purge on a new day. Keep user preferences out of here.
const PURGEABLE_KEYS_PREFIXES: string[] = [
  `${STORAGE_PREFIX}:classic`,
  `${STORAGE_PREFIX}:pixel`,
  `${STORAGE_PREFIX}:emoji`,
  `${STORAGE_PREFIX}:silhouette`,
  `${STORAGE_PREFIX}:progress`,
  `${STORAGE_PREFIX}:dailyChallenges`,
];

export function getTodayISO(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getLastKnownDate(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_DATE_KEY);
  } catch {
    return null;
  }
}

export function setLastKnownDate(dateISO: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_DATE_KEY, dateISO);
  } catch {
    // ignore
  }
}

export function readJson<T extends Json>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson<T extends Json>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function purgeDailyData(): void {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (PURGEABLE_KEYS_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/**
 * Ensures that daily data is fresh. If the last known date differs from today,
 * purge purgeable keys and set the last known date to today.
 * Returns true if a purge occurred.
 */
export function resetIfNewDay(now: Date = new Date()): boolean {
  const today = getTodayISO(now);
  const last = getLastKnownDate();
  if (last !== today) {
    purgeDailyData();
    setLastKnownDate(today);
    return true;
  }
  return false;
}

export const storageKeys = {
  lastDate: LAST_DATE_KEY,
  dailyChallenges: `${STORAGE_PREFIX}:dailyChallenges`,
  progress: `${STORAGE_PREFIX}:progress`,
  classicSession: `${STORAGE_PREFIX}:classic:session`,
  pixelSession: `${STORAGE_PREFIX}:pixel:session`,
  emojiSession: `${STORAGE_PREFIX}:emoji:session`,
  silhouetteSession: `${STORAGE_PREFIX}:silhouette:session`,
};


