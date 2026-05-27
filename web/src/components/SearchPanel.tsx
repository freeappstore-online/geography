import { useState, useMemo } from "react";
import { countries, formatPopulation, continents } from "../data";
import type { Continent } from "../types";

interface SearchPanelProps {
  onBack: () => void;
  onSelectCountry: (id: string) => void;
}

export function SearchPanel({ onBack, onSelectCountry }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [continentFilter, setContinentFilter] = useState<Continent | "all">(
    "all",
  );

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return countries.filter((c) => {
      if (
        continentFilter !== "all" &&
        c.continent !== continentFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    });
  }, [query, continentFilter]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onBack}
            className="text-sm text-[var(--color-accent)] font-medium hover:underline shrink-0"
          >
            ← Back
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, capital, continent..."
            autoFocus
            className="flex-1 px-3 py-2 rounded-[var(--radius-btn)] bg-[var(--color-panel)] border border-[var(--color-line)] text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {/* Continent filter chips */}
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setContinentFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              continentFilter === "all"
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-panel)] text-[var(--color-muted)]"
            }`}
          >
            All
          </button>
          {continents.map((c) => (
            <button
              key={c}
              onClick={() =>
                setContinentFilter(continentFilter === c ? "all" : c)
              }
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                continentFilter === c
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-panel)] text-[var(--color-muted)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 min-h-0 scroll-y px-4 py-2">
        <p className="text-xs text-[var(--color-muted)] mb-2">
          {results.length} {results.length === 1 ? "country" : "countries"}{" "}
          found
        </p>

        <div className="space-y-1">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCountry(c.id)}
              className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-card)] hover:bg-[var(--color-panel)] transition-colors text-left"
            >
              <span className="text-2xl">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{c.name}</div>
                <div className="text-xs text-[var(--color-muted)]">
                  {c.capital} · {c.continent} ·{" "}
                  {formatPopulation(c.population)}
                </div>
              </div>
              <span className="text-xs text-[var(--color-muted)]">→</span>
            </button>
          ))}

          {results.length === 0 && (
            <div className="text-center py-12 text-[var(--color-muted)]">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">No countries match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
