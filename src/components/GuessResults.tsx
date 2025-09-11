"use client";

import React from "react";
import Image from "next/image";
import type { Footballer } from "@/types/database";

export type ColumnKey = "position" | "nationality" | "club" | "league" | "rating" | "age";

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
  { key: "footballer", label: "Avatar" },
  { key: "position", label: "Position" },
  { key: "nationality", label: "Country" },
  { key: "club", label: "Club" },
  { key: "league", label: "League" },
  { key: "rating", label: "Rating" },
  { key: "age", label: "Age" },
];

function colorClass(c: CellResult["color"]): string {
  if (c === "green") return "bg-[#17d419]";
  if (c === "orange") return "bg-orange-500";
  return "bg-red-600";
}

export default function GuessResults({ rows, variant = "advanced" }: GuessResultsProps) {
  return (
    <div className="max-w-min mx-auto">
      <div className="overflow-x-auto">
        <div className="min-w-[520px] sm:min-w-[760px]">
          <div className="flex text-white text-xs sm:text-sm font-medium py-1 gap-[0.2rem] sm:gap-2 sm:justify-between">
            {headers.map((h) => (
              <div key={h.key} className={h.key === "footballer" ? "w-16 sm:w-24 text-center" : "w-16 sm:w-24 text-center"}>
                {h.label}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[0.2rem] sm:gap-2 sm:justify-between mb-2">
            {headers.map((h) => (
              <div key={`${h.key}-underline`} className={h.key === "footballer" ? "w-16 sm:w-24" : "w-16 sm:w-24"}>
                <div className="h-0.5 sm:h-1 w-full bg-white" />
              </div>
            ))}
          </div>
          <div>
            {rows.map((row) => (
              <div key={row.footballer.id} className="flex items-center sm:justify-between py-1 text-white/90 gap-[0.2rem] sm:gap-2">
                <div className="w-16 sm:w-24 flex items-center justify-center">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24">
                    <Image
                      src={row.footballer.avatar}
                      alt={row.footballer.fullname}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 640px) 4rem, 6rem"
                      unoptimized
                    />
                  </div>
                </div>
                {(headers.filter(h => h.key !== "footballer") as { key: ColumnKey; label: string }[]).map(({ key }) => {
                  const cell = row.cells[key];
                  const isImage = typeof cell.value === "string" && /^https?:\/\//.test(cell.value as string);
                  const emphasize = key === "position" || key === "rating" || key === "age";
                  return (
                    <div key={key} className={`relative w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-center text-[12px] sm:text-[15px] ${colorClass(cell.color)} rounded-md p-1 border-[0.8px] border-white/50 hover:brightness-110 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`}> 
                      {isImage ? (
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                          <Image
                            src={String(cell.value)}
                            alt={String(key)}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 2rem, 3rem"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <>
                          {cell.arrow ? (
                            <svg aria-hidden className="absolute inset-0 m-auto opacity-50" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                              {cell.arrow === "up" ? (
                                <polygon points="50,12 80,48 62,48 62,88 38,88 38,48 20,48" fill="rgba(0,0,0,0.55)" />
                              ) : (
                                <polygon points="50,88 80,52 62,52 62,12 38,12 38,52 20,52" fill="rgba(0,0,0,0.55)" />
                              )}
                            </svg>
                          ) : null}
                          <span className={`relative z-10 max-w-[3.6rem] sm:max-w-[5.5rem] break-words whitespace-normal leading-tight inline-flex items-center justify-center text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] ${emphasize ? "text-xl sm:text-2xl" : ""}`}>
                            {String(cell.value)}
                          </span>
                        </>
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


