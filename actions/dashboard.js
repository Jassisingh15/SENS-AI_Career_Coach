"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { groq } from "@/lib/groq";

/* ================= AI INSIGHTS ================= */
export const generateAIInsights = async (industry) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert career analyst. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Give detailed industry insights for: ${industry}

Return ONLY JSON:
{
  "salaryRanges": [
    {
      "role": "string",
      "min": number,
      "max": number,
      "median": number,
      "location": "string"
    }
  ],
  "growthRate": number,
  "demandLevel": "Low | Medium | High",
  "topSkills": ["string"],
  "marketOutlook": "string",
  "keyTrends": ["string"],
  "recommendedSkills": ["string"]
}
          `,
        },
      ],
      temperature: 0.7,
    });

    const text = res.choices[0].message.content;

    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.log("❌ GROQ ERROR:", error);

    return {
      salaryRanges: [
        {
          role: "Software Developer",
          min: 300000,
          max: 1200000,
          median: 600000,
          location: "India",
        },
      ],
      growthRate: 12,
      demandLevel: "High",
      topSkills: ["JavaScript", "React", "Node.js"],
      marketOutlook: "Positive",
      keyTrends: ["AI Adoption", "Cloud Computing"],
      recommendedSkills: ["System Design", "TypeScript"],
    };
  }
};

/* ================= GET INSIGHTS ================= */
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const industry = user.industry || "software development";

  console.log("USER INDUSTRY:", industry);

  let insight = await db.industryInsight.findFirst({
    where: {
      industry,
    },
  });

  if (!insight) {
    const data = await generateAIInsights(industry);

    insight = await db.industryInsight.create({
      data: {
        industry,
        ...data,
      },
    });
  }

  return insight;
}