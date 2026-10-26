# InterviewSpark

Practice real interviews before the real ones.

InterviewSpark runs a timed mock interview for the role you're targeting. You answer one question at a time by typing or speaking, then get each answer scored and a final report with specific feedback.

**Live:** https://interviewsparks.netlify.app

![InterviewSpark setup screen](./docs/setup.png)

## What you get

- **Role-specific questions** for 15 roles, from Software Engineer to Sales
- **Three focus areas:** behavioral, technical, and case study
- **Four difficulty levels**, from junior to expert, with 4 to 10 questions per session
- **Scores on six dimensions:** clarity, confidence, relevance, communication, conciseness, and technical depth
- **A final report** with strengths, weak points, and next steps
- **A dashboard** that tracks every session and your average by skill

## How a session works

1. Pick a role, focus, and difficulty. Optionally name a company to tailor the questions.
2. Answer each question by typing or using voice input.
3. Review your score after each answer.
4. Finish the session to get your overall feedback.

## Stack

Next.js and TypeScript, Tailwind CSS, PostgreSQL, Groq for question generation and scoring, PayMongo for credit top-ups, and Netlify for hosting.

## Run it locally

```bash
git clone https://github.com/ehrvayn/InterviewSpark.git
cd InterviewSpark
npm install
npm run dev
```

Then open http://localhost:3000. You'll need your own database and API keys in a local `.env.local` file.

## License

All rights reserved.
