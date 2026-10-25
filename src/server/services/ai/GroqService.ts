import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-120b";
const DEFAULT_COMPANY = "a leading tech company";

const FALLBACK_FIRST_QUESTION =
  "Tell me about a time you faced a challenge and how you handled it.";
const FALLBACK_NEXT_QUESTION =
  "What would you do differently if you had to make that decision again?";

export class AIGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIGenerationError";
  }
}

const cleanText = (text: string) =>
  text
    .replace(/\*\*/g, "")
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .trim();

const withinWordLimit = (text: string, maxWords: number) =>
  text.length > 0 && text.split(/\s+/).length <= maxWords;

const getContent = (
  choice:
    | { message?: { content?: string | null }; finish_reason?: string | null }
    | undefined,
) => (choice?.message?.content ?? "").trim();

const generateQuestion = async (params: {
  system: string;
  user: string;
  maxWords: number;
  fallback: string;
}): Promise<string> => {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1500,
    reasoning_effort: "low",
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
  });

  const text = cleanText(getContent(completion.choices[0]));

  if (!withinWordLimit(text, params.maxWords)) {
    console.warn("Question rejected, using fallback:", {
      finish_reason: completion.choices[0]?.finish_reason,
      length: text.length,
    });
    return params.fallback;
  }

  return text;
};

export const generateFirstQuestion = async (
  type: string,
  role: string,
  difficulty: string,
  company: string,
): Promise<string> => {
  const companyName = company?.trim() || DEFAULT_COMPANY;

  try {
    return await generateQuestion({
      system: `You are a Lead Interviewer at ${companyName}. You write one ${difficulty}-level ${type} interview question for a ${role}. Output only the question text. No reasoning, no preamble, no quotes, no markdown.`,
      user: `Write one ${difficulty}-level ${type} interview question for a ${role} at ${companyName}.

Calibration:
- BEHAVIORAL: Junior focuses on coachability, handling mistakes, and teamwork. Intermediate/Senior focuses on conflict resolution, leading projects, and influencing stakeholders without authority.
- TECHNICAL: Junior focuses on implementation details, basic syntax, and best practices. Intermediate/Senior focuses on system design, performance trade-offs, and maintainability.
- CASE STUDY: Junior focuses on breaking a small feature request into logical steps. Intermediate/Senior focuses on architectural pivots, scaling bottlenecks, and business-impact alignment.

Format:
- One opening sentence: a realistic scenario involving ${companyName}.
- One direct question that requires ${difficulty}-level expertise.
- Conversational tone, not a textbook.
- Under 40 words total. Output only the question text.`,
      maxWords: 60,
      fallback: FALLBACK_FIRST_QUESTION,
    });
  } catch (error) {
    console.error("Groq question generation error:", error);
    return FALLBACK_FIRST_QUESTION;
  }
};

export const generateNextQuestion = async (
  previousQuestion: string,
  userAnswer: string,
  role: string,
  company: string,
  difficulty: string,
): Promise<string> => {
  const companyName = company?.trim() || DEFAULT_COMPANY;

  try {
    return await generateQuestion({
      system: `You are a Senior Interviewer at ${companyName}. You are an active listener who dislikes pre-packaged answers. You find the gap between what the candidate said and what they actually did. You focus on ${difficulty}-level expectations for a ${role}. Output only the question text.`,
      user: `Previous question: ${previousQuestion}
Candidate's answer: ${userAnswer}

Write one high-pressure follow-up question.
- Target the weakest part of the answer. If it was vague on technical details, ask "how". If the candidate took too much credit, ask about the team's role.
- For juniors, ask what they learned from the friction. For seniors, ask about a long-term trade-off or a "what if" scenario.
- Direct and conversational. No praise, no "thank you".
- Under 30 words. Output only the question.`,
      maxWords: 50,
      fallback: FALLBACK_NEXT_QUESTION,
    });
  } catch (error) {
    console.error("Groq follow-up generation error:", error);
    return FALLBACK_NEXT_QUESTION;
  }
};

export type ScoreResult = {
  clarity: number;
  confidence: number;
  relevance: number;
  communication: number;
  conciseness: number;
  technical_depth: number;
  score: number;
};

const SCORE_KEYS: (keyof ScoreResult)[] = [
  "clarity",
  "confidence",
  "relevance",
  "communication",
  "conciseness",
  "technical_depth",
  "score",
];

export const scoreAnswer = async (
  question: string,
  answer: string,
  role: string,
  company: string,
): Promise<ScoreResult> => {
  const companyName = company?.trim() || DEFAULT_COMPANY;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    reasoning_effort: "low",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert interview evaluator at ${companyName} assessing candidates for a ${role} position. You reward specificity, structured thinking, and demonstrated experience. You penalize vagueness, lack of ownership, and irrelevant rambling. Respond with a JSON object only.`,
      },
      {
        role: "user",
        content: `Score this answer from a ${role} candidate at ${companyName}. Each metric is an integer or decimal from 1 to 10.

Question: ${question}
Answer: ${answer}

Metrics:
- clarity: how clearly and concisely the candidate communicated (1=incoherent, 10=exceptionally clear)
- confidence: how assured and decisive they sound. Penalize hedging like "I think maybe" or "I don't know" (1=very uncertain, 10=highly confident)
- relevance: how directly the answer addresses the question (1=off-topic, 10=on-point with strong support)
- communication: how effectively they explain their thinking (1=poor, 10=excellent)
- conciseness: how efficiently they answer without unnecessary detail (1=verbose, 10=focused)
- technical_depth: depth of technical understanding shown (1=superficial, 10=expert)
- score: overall impression as a ${companyName} interviewer. Would you move this candidate forward? (1=strong no, 10=strong yes)

Return exactly this JSON shape: {"clarity": X, "confidence": X, "relevance": X, "communication": X, "conciseness": X, "technical_depth": X, "score": X}`,
      },
    ],
  });

  const choice = completion.choices[0];
  const raw = getContent(choice);

  if (!raw) {
    throw new AIGenerationError(
      `Scoring returned no content (finish_reason: ${choice?.finish_reason ?? "unknown"}).`,
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match)
      throw new AIGenerationError("Scoring returned non-JSON content.");
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new AIGenerationError("Scoring returned malformed JSON.");
    }
  }

  const scores = {} as ScoreResult;
  for (const key of SCORE_KEYS) {
    const value = Number(parsed[key]);
    if (!Number.isFinite(value)) {
      throw new AIGenerationError(`Scoring is missing a valid "${key}" value.`);
    }
    scores[key] = Math.min(10, Math.max(0, Math.round(value * 10) / 10));
  }

  return scores;
};

export const generateFinalFeedback = async (
  allQuestions: { question_text: string; user_answer: string; score: number }[],
  role: string,
  company: string,
): Promise<string> => {
  const companyName = company?.trim() || DEFAULT_COMPANY;

  const qaHistory = allQuestions
    .map(
      (q, i) =>
        `Q${i + 1}: ${q.question_text}\nAnswer: ${q.user_answer}\nScore: ${q.score}/10`,
    )
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 2500,
    reasoning_effort: "low",
    messages: [
      {
        role: "system",
        content: `You are a world-class interview coach who prepares candidates for ${role} roles at companies like ${companyName}. You give honest, specific, actionable feedback grounded in what the candidate actually said. You never give generic advice. You write like a mentor who wants the candidate to land the offer.`,
      },
      {
        role: "user",
        content: `Review this candidate's full interview for a ${role} position at ${companyName}:

${qaHistory}

Use exactly this structure. Each bullet is one sentence.

**Strengths:**
1. [what they did well and why it matters at ${companyName}]
2. [same]
3. [same]

**Areas to Improve:**
1. [what they missed and why it matters for a ${role} at ${companyName}]
2. [same]
3. [same]

**Actionable Tips:**
1. [exactly what to do differently next time]
2. [same]
3. [same]

**Final Thought:**
[one casual, encouraging sentence, like a friend who watched them practice]

Be specific and brief. No fluff, no repetition, no praise padding.`,
      },
    ],
  });

  const feedback = getContent(completion.choices[0]);

  if (!feedback) {
    throw new AIGenerationError("Feedback generation returned no content.");
  }

  return feedback;
};
