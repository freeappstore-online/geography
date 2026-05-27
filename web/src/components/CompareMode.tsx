import { useState } from "react";
import {
  countries,
  getCountry,
  formatPopulation,
  formatArea,
  formatGdp,
  populationDensity,
  gdpPerCapita,
} from "../data";

interface CompareModeProps {
  onBack: () => void;
  onSelectCountry: (id: string) => void;
}

export function CompareMode({ onBack, onSelectCountry }: CompareModeProps) {
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<"left" | "right" | null>("left");

  const left = leftId ? getCountry(leftId) : undefined;
  const right = rightId ? getCountry(rightId) : undefined;

  const selectCountry = (id: string) => {
    if (selecting === "left") {
      setLeftId(id);
      setSelecting(rightId ? null : "right");
    } else if (selecting === "right") {
      setRightId(id);
      setSelecting(null);
    }
  };

  const comparisonRows: Array<{
    label: string;
    leftVal: string;
    rightVal: string;
    leftNum: number;
    rightNum: number;
  }> =
    left && right
      ? [
          {
            label: "Population",
            leftVal: formatPopulation(left.population),
            rightVal: formatPopulation(right.population),
            leftNum: left.population,
            rightNum: right.population,
          },
          {
            label: "Area",
            leftVal: formatArea(left.area),
            rightVal: formatArea(right.area),
            leftNum: left.area,
            rightNum: right.area,
          },
          {
            label: "GDP",
            leftVal: formatGdp(left.gdp),
            rightVal: formatGdp(right.gdp),
            leftNum: left.gdp,
            rightNum: right.gdp,
          },
          {
            label: "GDP/Capita",
            leftVal: `$${gdpPerCapita(left).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            rightVal: `$${gdpPerCapita(right).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            leftNum: gdpPerCapita(left),
            rightNum: gdpPerCapita(right),
          },
          {
            label: "Pop. Density",
            leftVal: `${populationDensity(left).toFixed(1)} /km²`,
            rightVal: `${populationDensity(right).toFixed(1)} /km²`,
            leftNum: populationDensity(left),
            rightNum: populationDensity(right),
          },
        ]
      : [];

  return (
    <div className="h-full scroll-y">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Back */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-4">Compare Countries</h2>

        {/* Selection slots */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setSelecting("left")}
            className={`p-4 rounded-[var(--radius-card)] border-2 text-center transition-colors ${
              selecting === "left"
                ? "border-[var(--color-accent)] bg-[var(--color-active)]"
                : "border-[var(--color-line)] bg-[var(--color-panel)]"
            }`}
          >
            {left ? (
              <>
                <span className="text-3xl block">{left.flag}</span>
                <span className="text-sm font-semibold mt-1 block">
                  {left.name}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--color-muted)]">
                Select first country
              </span>
            )}
          </button>
          <button
            onClick={() => setSelecting("right")}
            className={`p-4 rounded-[var(--radius-card)] border-2 text-center transition-colors ${
              selecting === "right"
                ? "border-[var(--color-accent)] bg-[var(--color-active)]"
                : "border-[var(--color-line)] bg-[var(--color-panel)]"
            }`}
          >
            {right ? (
              <>
                <span className="text-3xl block">{right.flag}</span>
                <span className="text-sm font-semibold mt-1 block">
                  {right.name}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--color-muted)]">
                Select second country
              </span>
            )}
          </button>
        </div>

        {/* Country picker */}
        {selecting && (
          <div className="mb-4">
            <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wider font-semibold">
              Choose {selecting === "left" ? "first" : "second"} country
            </p>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 scroll-y">
              {countries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCountry(c.id)}
                  disabled={
                    (selecting === "left" && c.id === rightId) ||
                    (selecting === "right" && c.id === leftId)
                  }
                  className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-btn)] text-xs text-left hover:bg-[var(--color-active)] disabled:opacity-30 transition-colors"
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {left && right && !selecting && (
          <div className="bg-[var(--color-panel)] rounded-[var(--radius-card)] p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-y-3 text-sm">
              {/* Header */}
              <div className="font-semibold text-center">
                {left.flag} {left.name}
              </div>
              <div />
              <div className="font-semibold text-center">
                {right.flag} {right.name}
              </div>

              {/* Data rows */}
              {comparisonRows.map((row) => {
                const leftWins = row.leftNum > row.rightNum;
                const rightWins = row.rightNum > row.leftNum;
                return (
                  <div key={row.label} className="contents">
                    <div
                      className={`text-right pr-3 py-1 ${leftWins ? "font-bold text-[var(--color-accent)]" : ""}`}
                    >
                      {row.leftVal}
                    </div>
                    <div className="text-center text-[var(--color-muted)] text-xs py-1 self-center">
                      {row.label}
                    </div>
                    <div
                      className={`text-left pl-3 py-1 ${rightWins ? "font-bold text-[var(--color-accent)]" : ""}`}
                    >
                      {row.rightVal}
                    </div>
                  </div>
                );
              })}

              {/* Non-numeric rows */}
              <div className="contents">
                <div className="text-right pr-3 py-1">{left.capital}</div>
                <div className="text-center text-[var(--color-muted)] text-xs py-1 self-center">
                  Capital
                </div>
                <div className="text-left pl-3 py-1">{right.capital}</div>
              </div>
              <div className="contents">
                <div className="text-right pr-3 py-1">
                  {left.languages.join(", ")}
                </div>
                <div className="text-center text-[var(--color-muted)] text-xs py-1 self-center">
                  Language
                </div>
                <div className="text-left pl-3 py-1">
                  {right.languages.join(", ")}
                </div>
              </div>
              <div className="contents">
                <div className="text-right pr-3 py-1">{left.currency}</div>
                <div className="text-center text-[var(--color-muted)] text-xs py-1 self-center">
                  Currency
                </div>
                <div className="text-left pl-3 py-1">{right.currency}</div>
              </div>
              <div className="contents">
                <div className="text-right pr-3 py-1">{left.continent}</div>
                <div className="text-center text-[var(--color-muted)] text-xs py-1 self-center">
                  Continent
                </div>
                <div className="text-left pl-3 py-1">{right.continent}</div>
              </div>
            </div>

            {/* Detail links */}
            <div className="flex justify-between mt-4 pt-3 border-t border-[var(--color-line)]">
              <button
                onClick={() => onSelectCountry(left.id)}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View {left.name} →
              </button>
              <button
                onClick={() => onSelectCountry(right.id)}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View {right.name} →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
