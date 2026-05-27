import { useState } from "react";
import type { Continent, ColorMode } from "../types";
import { mapPaths, continentOutlines, lngToX, latToY } from "../mapPaths";
import {
  countries,
  countryMap,
  CONTINENT_COLORS,
  populationDensity,
  gdpPerCapita,
} from "../data";

interface WorldMapProps {
  onSelectCountry: (id: string) => void;
  onSelectContinent: (c: Continent) => void;
  highlightId?: string;
}

const UN_REGION_COLORS: Record<string, string> = {
  "Northern Africa": "#e8a838",
  "Eastern Africa": "#d4923a",
  "Western Africa": "#c07c3c",
  "Southern Africa": "#e0b050",
  "Central Africa": "#b07040",
  "Eastern Asia": "#e05555",
  "Southern Asia": "#d44848",
  "South-Eastern Asia": "#c83c3c",
  "Western Asia": "#bc3030",
  "Central Asia": "#f06868",
  "Northern Europe": "#5b7db1",
  "Western Europe": "#4e6ea0",
  "Southern Europe": "#7090c0",
  "Eastern Europe": "#4060a0",
  "Northern America": "#6bba6b",
  "Central America": "#5daa5d",
  Caribbean: "#4f9a4f",
  "South America": "#c06bc0",
  "Australia and New Zealand": "#3dbdbd",
  "South-Eastern Oceania": "#30b0b0",
};

function getGradientColor(value: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (value - min) / (max - min);
  const r = Math.round(60 + t * 180);
  const g = Math.round(180 - t * 120);
  const b = Math.round(60 + (1 - t) * 80);
  return `rgb(${r},${g},${b})`;
}

export function WorldMap({ onSelectCountry, onSelectContinent, highlightId }: WorldMapProps) {
  const [colorMode, setColorMode] = useState<ColorMode>("continent");

  const densities = countries.map(populationDensity);
  const minDensity = Math.min(...densities);
  const maxDensity = Math.max(...densities);

  const gdpPerCapitas = countries.map(gdpPerCapita);
  const minGdp = Math.min(...gdpPerCapitas);
  const maxGdp = Math.max(...gdpPerCapitas);

  function getFill(countryId: string): string {
    const country = countryMap.get(countryId);
    if (!country) return "var(--color-muted)";

    switch (colorMode) {
      case "continent":
        return CONTINENT_COLORS[country.continent];
      case "population":
        return getGradientColor(
          populationDensity(country),
          minDensity,
          maxDensity,
        );
      case "gdp":
        return getGradientColor(gdpPerCapita(country), minGdp, maxGdp);
      case "region":
        return UN_REGION_COLORS[country.region] ?? "var(--color-muted)";
    }
  }

  const continentLabelPositions: Array<{
    continent: Continent;
    x: number;
    y: number;
  }> = [
    { continent: "North America", x: 190, y: 140 },
    { continent: "South America", x: 275, y: 310 },
    { continent: "Europe", x: 510, y: 95 },
    { continent: "Africa", x: 530, y: 270 },
    { continent: "Asia", x: 720, y: 140 },
    { continent: "Oceania", x: 820, y: 350 },
  ];

  const colorModes: Array<{ mode: ColorMode; label: string }> = [
    { mode: "continent", label: "Continent" },
    { mode: "population", label: "Pop. Density" },
    { mode: "gdp", label: "GDP/Capita" },
    { mode: "region", label: "UN Region" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Color mode selector */}
      <div className="shrink-0 flex items-center gap-1 px-4 py-2 overflow-x-auto">
        {colorModes.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setColorMode(mode)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              colorMode === mode
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-panel)] text-[var(--color-muted)] hover:bg-[var(--color-active)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="flex-1 min-h-0 px-2 pb-2">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          style={{ maxHeight: "100%" }}
        >
          {/* Ocean background */}
          <rect
            x="0"
            y="0"
            width="1000"
            height="500"
            fill="var(--color-panel)"
            rx="8"
          />

          {/* Continent outlines */}
          {continentOutlines.map((co) => (
            <path key={co.id} d={co.d} className="continent-outline" />
          ))}

          {/* Country paths */}
          {mapPaths.map((mp) => (
            <path
              key={mp.id}
              d={mp.d}
              fill={getFill(mp.id)}
              className={`map-country${highlightId === mp.id ? " selected" : ""}`}
              onClick={() => onSelectCountry(mp.id)}
            >
              <title>{countryMap.get(mp.id)?.name ?? mp.id}</title>
            </path>
          ))}

          {/* Country labels (small text for larger countries) */}
          {countries.map((c) => {
            const x = lngToX(c.lng);
            const y = latToY(c.lat);
            // Only show labels for larger countries
            if (c.area < 500_000) return null;
            return (
              <text
                key={c.id + "-label"}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none"
                fill="var(--color-ink)"
                fontSize="6"
                fontWeight="600"
                opacity="0.7"
              >
                {c.flag}
              </text>
            );
          })}

          {/* Continent click labels */}
          {continentLabelPositions.map(({ continent, x, y }) => (
            <text
              key={continent}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--color-ink)"
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-display)"
              className="cursor-pointer"
              opacity="0.35"
              onClick={() => onSelectContinent(continent)}
            >
              {continent}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      {colorMode === "continent" && (
        <div className="shrink-0 flex flex-wrap items-center justify-center gap-3 px-4 pb-2 text-xs text-[var(--color-muted)]">
          {Object.entries(CONTINENT_COLORS).map(([name, color]) => (
            <span key={name} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: color }}
              />
              {name}
            </span>
          ))}
        </div>
      )}
      {(colorMode === "population" || colorMode === "gdp") && (
        <div className="shrink-0 flex items-center justify-center gap-2 px-4 pb-2 text-xs text-[var(--color-muted)]">
          <span>Low</span>
          <div
            className="w-24 h-3 rounded-sm"
            style={{
              background: "linear-gradient(to right, rgb(60,180,140), rgb(240,60,60))",
            }}
          />
          <span>High</span>
        </div>
      )}
    </div>
  );
}
