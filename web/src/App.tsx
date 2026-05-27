import { useState, useCallback } from "react";
import type { AppView, Continent, QuizType } from "./types";
import { WorldMap } from "./components/WorldMap";
import { CountryDetail } from "./components/CountryDetail";
import { ContinentView } from "./components/ContinentView";
import { Quiz } from "./components/Quiz";
import { CompareMode } from "./components/CompareMode";
import { SearchPanel } from "./components/SearchPanel";
import { NavBar } from "./components/NavBar";

export function App() {
  const [view, setView] = useState<AppView>({ kind: "map" });

  const goMap = useCallback(() => setView({ kind: "map" }), []);
  const goCountry = useCallback(
    (id: string) => setView({ kind: "country", countryId: id }),
    [],
  );
  const goContinent = useCallback(
    (c: Continent) => setView({ kind: "continent", continent: c }),
    [],
  );
  const goQuiz = useCallback(
    (t: QuizType) => setView({ kind: "quiz", quizType: t }),
    [],
  );
  const goCompare = useCallback(() => setView({ kind: "compare" }), []);
  const goSearch = useCallback(() => setView({ kind: "search" }), []);

  return (
    <div className="flex flex-col h-full bg-[var(--color-paper)]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
        <button
          onClick={goMap}
          className="flex items-center gap-2 text-left"
        >
          <span className="text-2xl">🌍</span>
          <h1 className="text-lg font-bold leading-tight">Geography</h1>
        </button>
        <button
          onClick={goSearch}
          className="px-3 py-1.5 rounded-[var(--radius-btn)] bg-[var(--color-panel)] text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-active)] transition-colors"
        >
          Search...
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0 relative">
        {view.kind === "map" && (
          <WorldMap
            onSelectCountry={goCountry}
            onSelectContinent={goContinent}
          />
        )}
        {view.kind === "country" && (
          <CountryDetail
            countryId={view.countryId}
            onBack={goMap}
            onSelectCountry={goCountry}
          />
        )}
        {view.kind === "continent" && (
          <ContinentView
            continent={view.continent}
            onBack={goMap}
            onSelectCountry={goCountry}
          />
        )}
        {view.kind === "quiz" && (
          <Quiz quizType={view.quizType} onBack={goMap} />
        )}
        {view.kind === "compare" && (
          <CompareMode onBack={goMap} onSelectCountry={goCountry} />
        )}
        {view.kind === "search" && (
          <SearchPanel
            onBack={goMap}
            onSelectCountry={goCountry}
          />
        )}
      </main>

      {/* Bottom nav */}
      <NavBar
        activeView={view.kind}
        onMap={goMap}
        onQuiz={goQuiz}
        onCompare={goCompare}
        onSearch={goSearch}
      />
    </div>
  );
}
