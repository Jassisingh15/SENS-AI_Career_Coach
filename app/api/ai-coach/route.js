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

    const completion =
      await groq.chat.completions.create({
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
- Flexible mode: If the user asks about any other field, career, or industry, you MUST answer it freely and correctly without restriction.

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
- Do NOT restrict answers when user asks about other fields
- Do NOT force everything into the user's industry
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

    const answer =
      completion.choices[0]?.message?.content;

    return Response.json({
      answer,
    });
  } catch (error) {
    console.log("GROQ ERROR:", error);

    return Response.json({
      answer:
        "AI service is temporarily unavailable.",
    });
  }
}