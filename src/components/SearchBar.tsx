"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { searchFootballers } from "@/lib/data";
import type { Footballer } from "@/types/database";

type MinimalFootballer = Pick<Footballer, "id" | "fullname" | "avatar">;

type SearchBarProps = {
  placeholder?: string;
  onSelect: (footballer: MinimalFootballer) => void;
  buttonLabel?: string;
};

export default function SearchBar({ placeholder = "Search any player...", onSelect, buttonLabel = "Guess" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MinimalFootballer[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounced search
  useEffect(() => {
    let ignore = false;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const resp = await searchFootballers(query);
        if (!ignore) setResults(resp);
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(id);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = useCallback((f: MinimalFootballer) => {
    onSelect(f);
    setQuery("");
    setResults([]);
    setOpen(false);
  }, [onSelect]);

  const canSubmit = useMemo(() => query.trim().length > 0 && results.length > 0, [query, results]);

  const submitTop = useMemo(() => results[0], [results]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 form-input px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f0d36c]"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="px-4 py-2 rounded-md bg-[#f0d36c] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => submitTop && handleSelect(submitTop)}
          disabled={!canSubmit}
          type="button"
        >
          {buttonLabel}
        </button>
      </div>
      {open && results.length > 0 && (
        <div className="relative z-20 mt-2 w-full max-h-40 overflow-auto rounded-md bg-[#0a141c] border border-white/10 shadow-xl">
          {results.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelect(f)}
              className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-3 text-white/90"
            >
              <span className="relative w-8 h-8 rounded overflow-hidden">
                <Image
                  src={f.avatar}
                  alt={f.fullname}
                  fill
                  className="object-cover"
                  sizes="2rem"
                  unoptimized
                  priority
                  fetchPriority="high"
                />
              </span>
              <span className="text-sm">{f.fullname}</span>
            </button>
          ))}
          {loading ? (
            <div className="px-3 py-2 text-xs text-white/60">Searching…</div>
          ) : null}
        </div>
      )}
    </div>
  );
}


