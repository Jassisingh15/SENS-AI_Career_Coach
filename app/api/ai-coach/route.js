import { groq } from "@/lib/groq";

export async function POST(req) {
  try {
    const body = await req.json();

    const input = body.input;

    const industry = body.industry;

    if (!input) {
      return Response.json({
        answer: "Please enter a question.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",

          content: `
You are SENSAI AI, an intelligent AI Career Guidance Assistant.

The user belongs to:

Industry: ${industry}

Your role:
- Default: Give career guidance based on the user's industry.
- Related mode: If the user asks about a DIFFERENT career, field, or industry (e.g. a tech user asking about medicine, finance, design), answer it freely and correctly without restriction, since it is still career-related.
- Off-topic mode: If the user asks about something that is NOT career-related at all (e.g. sports, movies, cricket scores, gossip, random general knowledge), you must:
  1. Politely warn them that this assistant is meant for career guidance in their field (${industry}), and they should ideally ask career-related questions.
  2. Still answer their off-topic question, but ONLY briefly (1-2 short sentences max).
  3. Always put the warning first, then the short answer after it.

You help users with:
- Career Guidance
- Skill Analysis
- Career Roadmaps
- Resume Suggestions
- Interview Preparation
- Career Comparison
- Future Tech Trends

Rules:
- Give modern, practical answers
- Use headings and bullet points
- Keep answers clean and readable
- Be motivational and professional
- Never fully refuse an off-topic question, just warn and keep the answer short
- Do NOT force career-related questions about other fields into the user's own industry
`,
        },

        {
          role: "user",
          content: input,
        },
      ],

      temperature: 0.7,

      max_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content;

    return Response.json({
      answer,
    });
  } catch (error) {
    console.log("GROQ ERROR:", error);

    return Response.json({
      answer: "AI service is temporarily unavailable.",
    });
  }
}
