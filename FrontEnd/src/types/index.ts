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
  | "payment-success"
  | "payment-failed";

export type Role =
  | "Software Engineer"
  | "Frontend Developer"
  | "Backend Developer"
  | "Fullstack Developer"
  | "Mobile Developer"
  | "Data Scientist"
  | "Data Engineer"
  | "DevOps Engineer"
  | "Product Manager"
  | "Product Designer"
  | "UX Designer"
  | "QA Engineer"
  | "Cybersecurity"
  | "Marketing"
  | "Sales";
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
