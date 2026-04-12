export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  credit: number;
};

export type Page =
  | "landing"
  | "dashboard"
  | "interview"
  | "progress"
  | "questions"
  | "logout";

export type Role =
  | "Software Engineer"
  | "Product Manager"
  | "Data Scientist"
  | "Sales"
  | "UX Designer"
  | "Marketing";

export type InterviewType = "behavioral" | "technical" | "case-study";

export type DifficultyLevel = "junior" | "intermediate" | "senior" | "expert";

export interface NavItem {
  id: Page;
  label: string;
  icon: any;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface Question {
  id: string;
  text: string;
  role: Role;
  type: InterviewType;
  difficulty: DifficultyLevel;
  company?: string;
}

export interface SessionResult {
  date: string;
  role: Role;
  score: number;
  duration: string;
  type: InterviewType;
}
