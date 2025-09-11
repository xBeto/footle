import { supabase } from "@/utils/supabase";
import type { DailyChallenge, Footballer } from "@/types/database";

const CDN_URL = "https://cdn.footle.xyz/footballers.json";

let footballersCache: Footballer[] | null = null;
let footballersLoadingPromise: Promise<Footballer[]> | null = null;

async function loadFootballersFromCDN(): Promise<Footballer[]> {
  if (footballersCache) return footballersCache;
  if (footballersLoadingPromise) return footballersLoadingPromise;
  footballersLoadingPromise = (async () => {
    try {
      const isBrowser = typeof window !== "undefined";
      const url = isBrowser ? "/api/footballers" : CDN_URL;
      const res = await fetch(url, isBrowser ? undefined : { cache: "force-cache" });
      if (!res.ok) throw new Error(`Failed to fetch footballers: ${res.status}`);
      const raw = await res.json();
      const data: Footballer[] = (raw as any[]).map((f) => ({
        id: f.id,
        fullname: f.fullname,
        avatar: f.avatar,
        position: f.position,
        nationality: f.nationality,
        club: f.club,
        league: f.league,
        rating: f.rating,
        birthdate: new Date(f.birthdate),
        shield: f.shield,
      }));
      footballersCache = data;
      return data;
    } catch (e) {
      console.error(e);
      footballersCache = [];
      return footballersCache;
    } finally {
      footballersLoadingPromise = null;
    }
  })();
  return footballersLoadingPromise;
}

// Fetch all daily challenges
export async function getDailyChallenges(): Promise<DailyChallenge[]> {
  const { data, error } = await supabase
    .from("daily_challenge")
    .select("mode_id, footballer_id");

  if (error) {
    console.error("Error fetching daily challenges:", error.message);
    return [];
  }

  return (data as DailyChallenge[]) ?? [];
}

// Search footballers by name (case-insensitive)
export async function searchFootballers(query: string): Promise<Footballer[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const all = await loadFootballersFromCDN();
  const q = trimmed.toLowerCase();
  return all
    .filter((f) => f.fullname.toLowerCase().includes(q))
    .slice(0, 25);
}

export async function getFootballerById(id: number): Promise<Footballer | null> {
  const all = await loadFootballersFromCDN();
  return all.find((f) => f.id === id) ?? null;
}