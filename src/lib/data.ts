import { supabase } from "@/utils/supabase";
import type { DailyChallenge, Footballer } from "@/types/database";

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

  const { data, error } = await supabase
    .from("footballers")
    .select(
      "id, fullname, avatar"
    )
    .ilike("fullname", `%${trimmed}%`)
    .limit(25);

  if (error) {
    console.error("Error searching footballers:", error.message);
    return [];
  }
  return (data as Footballer[]) ?? [];
}

export async function getFootballerById(id: number): Promise<Footballer | null> {
  const { data, error } = await supabase
    .from("footballers")
    .select(
      "id, fullname, avatar, position, nationality, club, league, rating, birthdate, shield"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching footballer by id:", error.message);
    return null;
  }

  return (data as Footballer) ?? null;
}