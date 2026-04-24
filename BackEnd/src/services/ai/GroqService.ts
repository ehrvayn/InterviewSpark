import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateFirstQuestion = async (
  type: string,
  role: string,
  difficulty: string,
  company: string,
): Promise<string> => {
  try {
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are a Lead Interviewer at ${company}. You strictly calibrate questions based on the type and difficulty level selected. You focus on the specific competencies required for a ${difficulty} candidate in a ${type} context.`,
        },
        {
          role: "user",
          content: `Generate one ${difficulty}-level ${type} interview question for a ${role} at ${company}.

Calibration Matrix:
- BEHAVIORAL:
    * Junior: Focus on coachability, handling mistakes, and teamwork.
    * Intermediate/Senior: Focus on conflict resolution, leading projects, and influencing stakeholders without authority.
- TECHNICAL:
    * Junior: Focus on implementation details, basic syntax, and following best practices.
    * Intermediate/Senior: Focus on system design, performance trade-offs, and maintainability of complex logic.
- CASE STUDY:
    * Junior: Focus on breaking down a small feature request into logical steps.
    * Intermediate/Senior: Focus on architectural pivots, scaling bottlenecks, and business-impact alignment.

Requirements:
- Start with a 1-sentence "Hook" about a real-world scenario at ${company}.
- Ask a direct question that forces the candidate to demonstrate their ${difficulty}-level expertise.
- Must sound like a human conversation, not a textbook.
- Total length: Under 45 words. No preamble—just the question.`,
        },
      ],
    });

    const questionText = message.choices[0].message.content || "";
    return questionText;
  } catch (error) {
    console.error("Groq error:", error);
    throw error;
  }
};

export const scoreAnswer = async (
  question: string,
  answer: string,
  role: string,
  company: string,
): Promise<{
  clarity: number;
  confidence: number;
  relevance: number;
  score: number;
  technical_depth: number;
  communication: number;
  conciseness: number;
  question_text: string;
}> => {
  try {
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are an expert interview evaluator at ${company} assessing candidates for a ${role} position. You score answers with precision and objectivity based on what ${company} values in a ${role}. You reward specificity, structured thinking, and demonstrated experience. You penalize vagueness, lack of ownership, and irrelevant rambling. You always respond in valid JSON only — no extra text, no markdown, no explanation.`,
        },
        {
          role: "user",
          content: `Evaluate this interview answer from a candidate applying for a ${role} role at ${company} and score each metric from 1 to 10:

Question: ${question}
Answer: ${answer}

Scoring criteria:
- clarity: How clearly and concisely the candidate communicated their thoughts (1=incoherent, 10=exceptionally clear and structured)
- confidence: How assured and decisive the candidate sounds — penalize heavy hedging, "I think maybe", "I don't know" (1=extremely uncertain, 10=highly confident and decisive)
- relevance: How directly and completely the answer addresses the question asked (1=completely off-topic, 10=perfectly on-point with strong supporting detail)
- communication: How effectively the candidate explains their thinking and engages with the question (1=poor communication, 10=excellent communication and articulation)
- conciseness: How efficiently the candidate delivers their answer without unnecessary elaboration (1=overly verbose, 10=concise and focused)
- technical_depth: How well the candidate demonstrates technical knowledge and understanding (1=superficial, 10=deep technical expertise)
- score: Overall impression as a ${company} interviewer — would you move this ${role} candidate forward? (1=strong no, 10=strong yes)

Respond in this exact JSON format only: {"clarity": X, "confidence": X, "relevance": X, "communication": X,"conciseness": X,"technical_depth": X, "score": X}`,
        },
      ],
    });

    const responseText = message.choices[0].message.content || "";
    const jsonMatch = responseText.match(/\{.*\}/s);
    const scores = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return scores;
  } catch (error) {
    console.error("Groq scoring error:", error);
    throw error;
  }
};

export const generateNextQuestion = async (
  previousQuestion: string,
  userAnswer: string,
  role: string,
  company: string,
  difficulty: string,
): Promise<string> => {
  try {
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are a Senior Interviewer at ${company}. You are an active listener who hates "pre-packaged" answers. Your goal is to find the gap between what the candidate said and what they actually did. You focus strictly on ${difficulty}-level expectations for a ${role}.`,
        },
        {
          role: "user",
          content: `Context: ${difficulty} ${role} interview at ${company}.
          
          Previous Question: ${previousQuestion}
          Candidate's Response: ${userAnswer}

          Task: Generate a high-pressure follow-up.
          1. Spot the weakest part: If they were vague on technicals, drill into the "How." If they took too much credit, ask about the "Team Pivot."
          2. Difficulty Check: For Juniors, ask about what they learned from the friction. For Seniors, ask about the long-term trade-off or a "What if" scenario.
          3. Tone: Direct, inquisitive, and conversational. No "Thank you for that answer." 
          4. Constraint: Under 35 words. Just the question.`,
        },
      ],
    });

    const questionText = message.choices[0].message.content || "";
    return questionText;
  } catch (error) {
    console.error("Groq generation error:", error);
    throw error;
  }
};

export const generateFinalFeedback = async (
  allQuestions: any[],
  role: string,
  company: string,
): Promise<string> => {
  try {
    const qaHistory = allQuestions
      .map(
        (q, i) =>
          `Q${i + 1}: ${q.question_text}\nAnswer: ${q.user_answer}\nScore: ${q.score}/10`,
      )
      .join("\n\n");

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are a world-class interview coach who specializes in preparing candidates for ${role} roles at companies like ${company}. You give brutally honest, highly actionable feedback grounded in what ${company} actually looks for. You don't sugarcoat weaknesses but you genuinely celebrate strengths. Your feedback is specific to what the candidate actually said — you never give generic advice. You write like a mentor who wants the candidate to land the offer.`,
        },
        {
          role: "user",
          content: `Review this candidate's full interview performance for a ${role} position at ${company} and provide feedback:

${qaHistory}

Write your feedback in this exact structure — each point is ONE sentence only, no exceptions:

**Strengths:**
1. [One sentence: what they did well and why it matters at ${company}]
2. [One sentence: what they did well and why it matters at ${company}]
3. [One sentence: what they did well and why it matters at ${company}]

**Areas to Improve:**
1. [One sentence: what they did wrong or missed and why it matters for a ${role} at ${company}]
2. [One sentence: what they did wrong or missed and why it matters for a ${role} at ${company}]
3. [One sentence: what they did wrong or missed and why it matters for a ${role} at ${company}]

**Actionable Tips:**
1. [One sentence: exactly what to do differently next time]
2. [One sentence: exactly what to do differently next time]
3. [One sentence: exactly what to do differently next time]

**Final Thought:**
[One casual, friendly closing sentence like you're a friend who just watched them practice — be genuine, encouraging, and real. No corporate speak.]

Be brutal, be specific, be brief. No fluff, no repetition, no praise padding.`,
        },
      ],
    });

    const feedback = message.choices[0].message.content || "";
    return feedback;
  } catch (error) {
    console.error("Groq feedback error:", error);
    throw error;
  }
};
