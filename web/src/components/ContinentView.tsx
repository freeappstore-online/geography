import type { Continent } from "../types";
import {
  countriesByContinent,
  formatPopulation,
  formatGdp,
  CONTINENT_COLORS,
} from "../data";

interface ContinentViewProps {
  continent: Continent;
  onBack: () => void;
  onSelectCountry: (id: string) => void;
}

export function ContinentView({ continent, onBack, onSelectCountry }: ContinentViewProps) {
  const ctryList = countriesByContinent(continent);
  const totalPop = ctryList.reduce((s, c) => s + c.population, 0);
  const totalGdp = ctryList.reduce((s, c) => s + c.gdp, 0);
  const totalArea = ctryList.reduce((s, c) => s + c.area, 0);

  return (
    <div className="h-full scroll-y">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          ← Back to World
        </button>

        {/* Header */}
        <div
          className="rounded-[var(--radius-card)] p-6 mb-4"
          style={{ background: CONTINENT_COLORS[continent] + "22" }}
        >
          <h2 className="text-2xl font-bold mb-2">{continent}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
            <span>{ctryList.length} countries</span>
            <span>Pop: {formatPopulation(totalPop)}</span>
            <span>GDP: {formatGdp(totalGdp)}</span>
            <span>Area: {totalArea.toLocaleString()} km²</span>
          </div>
        </div>

        {/* Country list */}
        <div className="space-y-2">
          {ctryList
            .sort((a, b) => b.population - a.population)
            .map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCountry(c.id)}
                className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-card)] bg-[var(--color-panel)] hover:bg-[var(--color-active)] transition-colors text-left"
              >
                <span className="text-3xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {c.capital} · {formatPopulation(c.population)} ·{" "}
                    {formatGdp(c.gdp)}
                  </div>
                </div>
                <span className="text-xs text-[var(--color-muted)]">→</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
