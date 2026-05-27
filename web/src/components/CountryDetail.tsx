import {
  getCountry,
  formatPopulation,
  formatArea,
  formatGdp,
  populationDensity,
  gdpPerCapita,
  countries,
} from "../data";

interface CountryDetailProps {
  countryId: string;
  onBack: () => void;
  onSelectCountry: (id: string) => void;
}

export function CountryDetail({ countryId, onBack, onSelectCountry }: CountryDetailProps) {
  const country = getCountry(countryId);

  if (!country) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-muted)]">Country not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-[var(--radius-btn)] bg-[var(--color-panel)] text-sm font-medium hover:bg-[var(--color-active)]"
        >
          Back to Map
        </button>
      </div>
    );
  }

  // Find neighbors (same continent, excluding self)
  const neighbors = countries
    .filter((c) => c.continent === country.continent && c.id !== country.id)
    .slice(0, 5);

  const statRow = (label: string, value: string) => (
    <div className="flex justify-between items-baseline py-2 border-b border-[var(--color-line)]">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="h-full scroll-y">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium hover:underline"
        >
          ← Back
        </button>

        {/* Header card */}
        <div className="bg-[var(--color-panel)] rounded-[var(--radius-card)] p-6 mb-4">
          <div className="text-6xl mb-3">{country.flag}</div>
          <h2 className="text-2xl font-bold mb-1">{country.name}</h2>
          <p className="text-[var(--color-muted)] text-sm">
            {country.continent} · {country.region}
          </p>
        </div>

        {/* Stats card */}
        <div className="bg-[var(--color-panel)] rounded-[var(--radius-card)] p-4 mb-4">
          <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
            Key Facts
          </h3>
          {statRow("Capital", country.capital)}
          {statRow("Population", formatPopulation(country.population))}
          {statRow("Area", formatArea(country.area))}
          {statRow(
            "Pop. Density",
            `${populationDensity(country).toFixed(1)} /km²`,
          )}
          {statRow("GDP (nominal)", formatGdp(country.gdp))}
          {statRow(
            "GDP per Capita",
            `$${gdpPerCapita(country).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          )}
          {statRow("Language(s)", country.languages.join(", "))}
          {statRow("Currency", country.currency)}
        </div>

        {/* Fun facts */}
        <div className="bg-[var(--color-panel)] rounded-[var(--radius-card)] p-4 mb-4">
          <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">
            Fun Facts
          </h3>
          <ul className="space-y-2">
            {country.funFacts.map((fact, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-[var(--color-accent)] shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Neighbors in same continent */}
        {neighbors.length > 0 && (
          <div className="bg-[var(--color-panel)] rounded-[var(--radius-card)] p-4 mb-4">
            <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">
              More in {country.continent}
            </h3>
            <div className="flex flex-wrap gap-2">
              {neighbors.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onSelectCountry(n.id)}
                  className="px-3 py-1.5 rounded-[var(--radius-btn)] bg-[var(--color-active)] text-sm font-medium hover:bg-[var(--color-line)] transition-colors"
                >
                  {n.flag} {n.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
