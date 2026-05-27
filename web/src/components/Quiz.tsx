import { useState, useCallback, useMemo } from "react";
import type { QuizType, QuizState, Difficulty } from "../types";
import { countries, countryMap, easyCountryIds } from "../data";

interface QuizProps {
  quizType: QuizType;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    const swp = copy[j];
    if (tmp !== undefined && swp !== undefined) {
      copy[i] = swp;
      copy[j] = tmp;
    }
  }
  return copy;
}

function pickChoices(
  correctId: string,
  pool: string[],
  count: number,
): string[] {
  const others = pool.filter((id) => id !== correctId);
  const shuffled = shuffle(others).slice(0, count - 1);
  return shuffle([correctId, ...shuffled]);
}

const QUIZ_LENGTH = 10;

function generateQuestion(
  difficulty: Difficulty,
): { countryId: string; choices: string[] } {
  const pool =
    difficulty === "easy"
      ? countries.filter((c) => easyCountryIds.has(c.id)).map((c) => c.id)
      : countries.map((c) => c.id);

  const shuffled = shuffle(pool);
  const countryId = shuffled[0];
  if (!countryId) {
    return { countryId: countries[0]?.id ?? "usa", choices: [] };
  }
  const choices = pickChoices(countryId, pool, 4);
  return { countryId, choices };
}

function initQuiz(type: QuizType, difficulty: Difficulty): QuizState {
  const { countryId, choices } = generateQuestion(difficulty);
  return {
    type,
    difficulty,
    current: 1,
    total: QUIZ_LENGTH,
    score: 0,
    streak: 0,
    bestStreak: 0,
    questionCountryId: countryId,
    choices,
    answered: false,
    selectedChoice: null,
  };
}

export function Quiz({ quizType, onBack }: QuizProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [finished, setFinished] = useState(false);

  const startQuiz = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      setQuiz(initQuiz(quizType, d));
      setFinished(false);
    },
    [quizType],
  );

  const handleAnswer = useCallback(
    (choiceId: string) => {
      if (!quiz || quiz.answered) return;
      const correct = choiceId === quiz.questionCountryId;
      setQuiz((prev) => {
        if (!prev) return prev;
        const newStreak = correct ? prev.streak + 1 : 0;
        return {
          ...prev,
          answered: true,
          selectedChoice: choiceId,
          score: correct ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      });
    },
    [quiz],
  );

  const nextQuestion = useCallback(() => {
    if (!quiz || !difficulty) return;
    if (quiz.current >= quiz.total) {
      setFinished(true);
      return;
    }
    const { countryId, choices } = generateQuestion(difficulty);
    setQuiz((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        current: prev.current + 1,
        questionCountryId: countryId,
        choices,
        answered: false,
        selectedChoice: null,
      };
    });
  }, [quiz, difficulty]);

  const questionCountry = useMemo(
    () => (quiz ? countryMap.get(quiz.questionCountryId) : undefined),
    [quiz],
  );

  // Difficulty selection screen
  if (!difficulty || !quiz) {
    const titles: Record<QuizType, string> = {
      capital: "Capital Cities Quiz",
      flag: "Flag Quiz",
      map: "Map Quiz",
    };
    const descriptions: Record<QuizType, string> = {
      capital: "Name the capital city of each country",
      flag: "Identify the country from its flag emoji",
      map: "Guess which country is highlighted on the map",
    };

    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{titles[quizType]}</h2>
          <p className="text-[var(--color-muted)] text-sm">
            {descriptions[quizType]}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => startQuiz("easy")}
            className="px-6 py-3 rounded-[var(--radius-card)] bg-green-500/20 text-green-600 font-semibold hover:bg-green-500/30 transition-colors"
          >
            Easy (20 countries)
          </button>
          <button
            onClick={() => startQuiz("hard")}
            className="px-6 py-3 rounded-[var(--radius-card)] bg-red-500/20 text-red-500 font-semibold hover:bg-red-500/30 transition-colors"
          >
            Hard (all {countries.length})
          </button>
        </div>

        <button
          onClick={onBack}
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to Map
        </button>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const pct = Math.round((quiz.score / quiz.total) * 100);
    const grade =
      pct >= 90
        ? "Excellent!"
        : pct >= 70
          ? "Great job!"
          : pct >= 50
            ? "Not bad!"
            : "Keep practicing!";

    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">
            {pct >= 90 ? "🏆" : pct >= 70 ? "⭐" : pct >= 50 ? "👍" : "📚"}
          </div>
          <h2 className="text-2xl font-bold mb-1">{grade}</h2>
          <p className="text-4xl font-bold text-[var(--color-accent)] mb-2">
            {quiz.score}/{quiz.total}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Best streak: {quiz.bestStreak}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => startQuiz(quiz.difficulty)}
            className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-accent)] text-white font-medium"
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-panel)] font-medium hover:bg-[var(--color-active)]"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  if (!questionCountry) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  // Quiz question
  const questionText = (() => {
    switch (quiz.type) {
      case "capital":
        return `What is the capital of ${questionCountry.name}?`;
      case "flag":
        return "Which country does this flag belong to?";
      case "map":
        return "Which country is this?";
    }
  })();

  const questionVisual = (() => {
    switch (quiz.type) {
      case "flag":
        return (
          <span className="text-7xl block text-center mb-4">
            {questionCountry.flag}
          </span>
        );
      case "map":
        return (
          <div className="text-center mb-4 bg-[var(--color-panel)] rounded-[var(--radius-card)] p-4">
            <span className="text-5xl">{questionCountry.flag}</span>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              {questionCountry.continent} · {questionCountry.region}
            </p>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="h-full flex flex-col px-4 py-4 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="shrink-0 mb-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={onBack}
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            ← Quit
          </button>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-muted)]">
              {quiz.current}/{quiz.total}
            </span>
            <span className="font-semibold text-[var(--color-accent)]">
              Score: {quiz.score}
            </span>
            {quiz.streak > 1 && (
              <span className="text-orange-500 font-semibold">
                🔥 {quiz.streak}
              </span>
            )}
          </div>
        </div>
        <div className="w-full h-1.5 bg-[var(--color-line)] rounded-full">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
            style={{ width: `${(quiz.current / quiz.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {questionVisual}
        <h3 className="text-xl font-bold text-center">{questionText}</h3>

        {/* Choices */}
        <div className="w-full grid grid-cols-1 gap-2 mt-4">
          {quiz.choices.map((choiceId) => {
            const choiceCountry = countryMap.get(choiceId);
            if (!choiceCountry) return null;

            const isCorrect = choiceId === quiz.questionCountryId;
            const isSelected = quiz.selectedChoice === choiceId;
            const showResult = quiz.answered;

            let btnClass =
              "w-full px-4 py-3 rounded-[var(--radius-card)] text-left font-medium text-sm transition-all ";
            if (showResult && isCorrect) {
              btnClass +=
                "bg-green-500/20 border-2 border-green-500 pop";
            } else if (showResult && isSelected && !isCorrect) {
              btnClass +=
                "bg-red-500/20 border-2 border-red-500 shake";
            } else if (showResult) {
              btnClass +=
                "bg-[var(--color-panel)] border-2 border-transparent opacity-50";
            } else {
              btnClass +=
                "bg-[var(--color-panel)] border-2 border-transparent hover:bg-[var(--color-active)] hover:border-[var(--color-accent)]";
            }

            const label = (() => {
              switch (quiz.type) {
                case "capital":
                  return choiceCountry.capital;
                case "flag":
                case "map":
                  return `${choiceCountry.flag} ${choiceCountry.name}`;
              }
            })();

            return (
              <button
                key={choiceId}
                onClick={() => handleAnswer(choiceId)}
                disabled={quiz.answered}
                className={btnClass}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {quiz.answered && (
          <button
            onClick={nextQuestion}
            className="mt-4 px-6 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-accent)] text-white font-medium"
          >
            {quiz.current >= quiz.total ? "See Results" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}
