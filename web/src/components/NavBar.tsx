import type { QuizType } from "../types";
import { useState } from "react";

interface NavBarProps {
  activeView: string;
  onMap: () => void;
  onQuiz: (type: QuizType) => void;
  onCompare: () => void;
  onSearch: () => void;
}

export function NavBar({ activeView, onMap, onQuiz, onCompare, onSearch }: NavBarProps) {
  const [showQuizMenu, setShowQuizMenu] = useState(false);

  const navBtn = (label: string, icon: string, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-[var(--radius-btn)] transition-colors text-xs font-medium ${
        isActive
          ? "text-[var(--color-accent)] bg-[var(--color-active)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="shrink-0 flex items-center justify-around px-2 py-2 border-t border-[var(--color-line)] bg-[var(--color-paper)] relative">
      {navBtn("Map", "\u{1F5FA}\u{FE0F}", activeView === "map", onMap)}

      {/* Quiz with submenu */}
      <div className="relative">
        {showQuizMenu && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--color-panel)] border border-[var(--color-line)] rounded-[var(--radius-card)] p-2 shadow-lg min-w-[140px] z-50">
            <button
              onClick={() => { onQuiz("capital"); setShowQuizMenu(false); }}
              className="block w-full text-left px-3 py-2 rounded-[var(--radius-btn)] text-sm hover:bg-[var(--color-active)] transition-colors"
            >
              🏛 Capitals
            </button>
            <button
              onClick={() => { onQuiz("flag"); setShowQuizMenu(false); }}
              className="block w-full text-left px-3 py-2 rounded-[var(--radius-btn)] text-sm hover:bg-[var(--color-active)] transition-colors"
            >
              🏴 Flags
            </button>
            <button
              onClick={() => { onQuiz("map"); setShowQuizMenu(false); }}
              className="block w-full text-left px-3 py-2 rounded-[var(--radius-btn)] text-sm hover:bg-[var(--color-active)] transition-colors"
            >
              📍 Map Quiz
            </button>
          </div>
        )}
        {navBtn("Quiz", "\u{1F9E0}", activeView === "quiz", () =>
          setShowQuizMenu((v) => !v),
        )}
      </div>

      {navBtn("Compare", "\u{2696}\u{FE0F}", activeView === "compare", onCompare)}
      {navBtn("Search", "\u{1F50D}", activeView === "search", onSearch)}
    </nav>
  );
}
