import type { DifficultyLevel } from "@/types";

export const getQuestionLimit = (
  difficulty: DifficultyLevel | string,
): number => {
  if (difficulty === "junior") return 4;
  if (difficulty === "intermediate") return 6;
  if (difficulty === "senior") return 8;
  return 10;
};
