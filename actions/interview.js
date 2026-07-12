"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { groq } from "@/lib/groq";

/* ================= GENERATE QUIZ ================= */
export async function generateQuiz({ industry, subfield } = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const finalIndustry = industry || user?.industry || "Technology";
  const finalSubfield = subfield || finalIndustry;

  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview question generator. Return ONLY valid JSON. No markdown, no extra text.",
        },
        {
          role: "user",
          content: `
Generate 10 HIGH-QUALITY MCQ questions strictly for the "${finalIndustry}" industry.

Rules:
- Questions MUST be related ONLY to ${finalIndustry}
- Do NOT include software or frontend development unless the industry is Technology
- Focus on real-world concepts, roles, and scenarios in ${finalIndustry}
- Each question must have 4 options (A, B, C, D)
- Must be real interview-level (FAANG style)
- Include explanation for each answer

Return ONLY this JSON format:

{
  "questions": [
    {
      "question": "",
      "options": ["A","B","C","D"],
      "correctAnswer": "",
      "explanation": ""
    }
  ]
}
          `,
        },
      ],
      temperature: 0.7,
    });

    let text = res.choices[0].message.content;

    // clean markdown if any
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.log("JSON parse error from Groq");
      throw new Error("AI returned invalid format");
    }

    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid AI response structure");
    }

    return parsed;
  } catch (error) {
    console.log("Groq quiz generation failed:", error.message);

    // 🚨 SAFE FALLBACK (so app never breaks)
    return {
      questions: [
        {
          question: "Explain REST API in simple terms?",
          options: [
            "A communication style for web services",
            "A database type",
            "A programming language",
            "An operating system",
          ],
          correctAnswer: "A communication style for web services",
          explanation:
            "REST API is a way for systems to communicate over HTTP.",
        },
        {
          question: "What is React?",
          options: [
            "Backend framework",
            "Database",
            "Frontend library",
            "Operating system",
          ],
          correctAnswer: "Frontend library",
          explanation:
            "React is a JavaScript library for building UI.",
        },
      ],
    };
  }
}

/* ================= SAVE RESULT ================= */
export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = (questions || []).map((q, index) => ({
    question: q?.question || "",
    answer: q?.correctAnswer || "",
    userAnswer: answers?.[index] || "",
    isCorrect: q?.correctAnswer === answers?.[index],
    explanation: q?.explanation || "",
  }));

  return await db.assessment.create({
    data: {
      userId: user.id,
      quizScore: score,
      questions: questionResults,
      category: "General",
    },
  });
}

/* ================= GET ASSESSMENTS ================= */
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}