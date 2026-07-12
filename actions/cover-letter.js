"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { groq } from "@/lib/groq";

/* ================= GENERATE COVER LETTER ================= */
export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional cover letter writer. Write only clean markdown text.",
        },
        {
          role: "user",
          content: `
Write a highly personalized and professional cover letter.

Job Details:
- Company: ${data.companyName}
- Role: ${data.jobTitle}

Candidate Profile:
- Industry: ${user.industry}
- Experience: ${user.experience}
- Skills: ${user.skills?.join(", ")}
- Bio: ${user.bio}

Job Description:
${data.jobDescription}

Instructions:
- Analyze the job description and identify key required skills
- Highlight matching skills from the candidate profile
- Show how candidate is a good fit for the role
- Use strong action words and achievements
- Keep tone professional and impactful
- Avoid generic phrases

Output:
- Max 300–400 words
- Clean markdown format
`,
        },
      ],
      temperature: 0.7,
    });

    const content = res.choices[0].message.content.trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Cover letter AI error:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function improveCoverLetter(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach.",
        },
        {
          role: "user",
          content: `
Improve the following cover letter:
- Make it more professional
- Improve clarity and impact
- Remove unnecessary words
- Make it concise

Cover Letter:
${content}
          `,
        },
      ],
      temperature: 0.7,
    });

    return res.choices[0].message.content.trim();
  } catch (error) {
    throw new Error("Failed to improve cover letter");
  }
}

/* ================= GET ALL ================= */
export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

/* ================= GET SINGLE ================= */
export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });
}

/* ================= DELETE ================= */
export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: { id },
  });
}
