"use client";

import React from "react";
import type { Footballer } from "@/types/database";

export type ColumnKey = "position" | "nationality" | "club" | "league" | "rating" | "birthyear";

export type CellResult = {
  value: string | number;
  color: "green" | "orange" | "red";
  arrow?: "up" | "down";
};

export type GuessRow = {
  footballer: Pick<Footballer, "id" | "fullname" | "avatar">;
  cells: Record<ColumnKey, CellResult>;
};

type GuessResultsProps = {
  rows: GuessRow[];
  variant?: "simple" | "advanced";
};

const headers: { key: ColumnKey | "footballer"; label: string }[] = [
  { key: "footballer", label: "Footballer" },
  { key: "position", label: "Position" },
  { key: "nationality", label: "Nationality" },
  { key: "club", label: "Club" },
  { key: "league", label: "League" },
  { key: "rating", label: "Rating" },
  { key: "birthyear", label: "Birth Year" },
];

function colorClass(c: CellResult["color"]): string {
  if (c === "green") return "bg-emerald-600/70 border-emerald-500";
  if (c === "orange") return "bg-orange-600/70 border-orange-500";
  return "bg-red-600/70 border-red-500";
}

export default function GuessResults({ rows, variant = "advanced" }: GuessResultsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="sticky top-0 z-10 bg-[#0a141c]/80 backdrop-blur border border-white/10 rounded-t-xl">
            <div className="flex text-white/80 text-xs sm:text-sm font-medium px-2 py-2" style={{ gap: "0.5rem" }}>
              {headers.map((h) => (
                <div key={h.key} className={h.key === "footballer" ? "w-20" : "w-24"}>
                  {h.label}
                </div>
              ))}
            </div>
          </div>
          <div className="border-x border-b border-white/10 rounded-b-xl divide-y divide-white/10">
            {rows.map((row) => (
              <div key={row.footballer.id} className="flex items-center px-2 py-2 text-white/90" style={{ gap: "0.5rem" }}>
                <div className="w-20 flex items-center justify-center">
                  <img src={row.footballer.avatar} alt={row.footballer.fullname} className="w-12 h-12 rounded object-cover border border-white/10" />
                </div>
                {(headers.filter(h => h.key !== "footballer") as { key: ColumnKey; label: string }[]).map(({ key }) => {
                  const cell = row.cells[key];
                  const arrow = cell.arrow === "up" ? "↑" : cell.arrow === "down" ? "↓" : "";
                  const isImage = typeof cell.value === "string" && /^https?:\/\//.test(cell.value as string);
                  return (
                    <div key={key} className={`w-24 h-16 flex items-center justify-center text-center text-xs sm:text-sm border ${colorClass(cell.color)} rounded-md px-2`}> 
                      {isImage ? (
                        <img src={String(cell.value)} alt={String(key)} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="whitespace-nowrap">{String(cell.value)} {arrow}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


