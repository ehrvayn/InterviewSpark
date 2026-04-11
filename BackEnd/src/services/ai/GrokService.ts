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
          content: `You are a senior recruiter at ${company} with 15+ years of experience hiring ${role}s. You know exactly what ${company} looks for in candidates and you craft questions that reveal whether someone truly has what it takes to succeed in this role at ${company} specifically. Your questions are incisive, thought-provoking, and go beyond surface-level to separate exceptional candidates from average ones.`,
        },
        {
          role: "user",
          content: `Generate a single ${difficulty}-level ${type} interview question for a ${role} position at ${company}.

Requirements:
- Tailor the question to reflect ${company}'s culture, values, and what they specifically look for in a ${role}
- The question must feel like it came from a real ${company} interviewer, not a generic textbook
- It should require the candidate to demonstrate actual experience, not just theoretical knowledge
- For behavioral questions: use situation-based framing that forces specific examples relevant to the ${role} scope
- For technical questions: include realistic constraints or trade-offs that a ${role} at ${company} would actually face
- Do NOT include any preamble, numbering, or explanation — just the question itself`,
        },
      ],
    });

    const questionText = message.choices[0].message.content || "";
    return questionText;
  } catch (error) {
    console.error("Grok error:", error);
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
- score: Overall impression as a ${company} interviewer — would you move this ${role} candidate forward? (1=strong no, 10=strong yes)

Respond in this exact JSON format only: {"clarity": X, "confidence": X, "relevance": X, "score": X}`,
        },
      ],
    });

    const responseText = message.choices[0].message.content || "";
    const jsonMatch = responseText.match(/\{.*\}/s);
    const scores = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return scores;
  } catch (error) {
    console.error("Grok scoring error:", error);
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
          content: `You are a sharp, experienced ${company} interviewer hiring for a ${role} position. You listen carefully to what the candidate says and ask intelligent follow-up questions that probe deeper. You know exactly what ${company} values in a ${role} and you steer the conversation to reveal whether this candidate truly has it. You pick up on vague claims, missing details, and interesting threads worth exploring.`,
        },
        {
          role: "user",
          content: `You are conducting a ${difficulty}-level interview for a ${role} position at ${company}. Based on the candidate's response below, generate your next interview question.

Previous Question: ${previousQuestion}
Candidate's Answer: ${userAnswer}

Your follow-up should:
- Dig deeper into something specific they mentioned (or notably avoided)
- Challenge any vague or unsupported claims they made
- Explore their decision-making process, trade-offs considered, or lessons learned
- Be relevant to what a ${role} at ${company} would actually encounter
- Feel like a natural continuation of the conversation, not a generic question
- Be direct and specific — no fluff

Respond with just the follow-up question, nothing else.`,
        },
      ],
    });

    const questionText = message.choices[0].message.content || "";
    return questionText;
  } catch (error) {
    console.error("Grok generation error:", error);
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
    console.error("Grok feedback error:", error);
    throw error;
  }
};
