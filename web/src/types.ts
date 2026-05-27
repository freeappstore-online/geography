export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export type UNRegion =
  | "Northern Africa"
  | "Eastern Africa"
  | "Western Africa"
  | "Southern Africa"
  | "Central Africa"
  | "Eastern Asia"
  | "Southern Asia"
  | "South-Eastern Asia"
  | "Western Asia"
  | "Central Asia"
  | "Northern Europe"
  | "Western Europe"
  | "Southern Europe"
  | "Eastern Europe"
  | "Northern America"
  | "Central America"
  | "Caribbean"
  | "South America"
  | "Australia and New Zealand"
  | "South-Eastern Oceania";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: Continent;
  region: UNRegion;
  population: number;
  area: number;
  gdp: number;
  languages: string[];
  currency: string;
  flag: string;
  funFacts: [string, string, string] | [string, string];
  lat: number;
  lng: number;
}

export type ColorMode = "continent" | "population" | "gdp" | "region";

export type QuizType = "capital" | "flag" | "map";
export type Difficulty = "easy" | "hard";

export interface QuizState {
  type: QuizType;
  difficulty: Difficulty;
  current: number;
  total: number;
  score: number;
  streak: number;
  bestStreak: number;
  questionCountryId: string;
  choices: string[];
  answered: boolean;
  selectedChoice: string | null;
}

export type AppView =
  | { kind: "map" }
  | { kind: "continent"; continent: Continent }
  | { kind: "country"; countryId: string }
  | { kind: "quiz"; quizType: QuizType }
  | { kind: "compare" }
  | { kind: "search" };
