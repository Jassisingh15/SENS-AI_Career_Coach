"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { groq } from "@/lib/groq";
import { revalidatePath } from "next/cache";

/* ================= SAVE RESUME ================= */
export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.upsert({
    where: { userId: user.id },
    update: { content },
    create: { userId: user.id, content },
  });

  revalidatePath("/resume");
  return resume;
}

/* ================= GET RESUME ================= */
export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: { userId: user.id },
  });
}

/* ================= AI IMPROVE ================= */
export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  let prompt = "";

  if (type === "experience") {
    prompt = `
Improve this work experience:

"${current}"

Make it:
- Professional
- Achievement focused
- Use strong action verbs
- Add measurable impact
    `;
  } else if (type === "education") {
    prompt = `
Improve this education section:

"${current}"

Make it:
- Clean and professional
- Highlight key skills and learning
    `;
  } else if (type === "project") {
    prompt = `
Improve this project:

"${current}"

Make it:
- Technical and impressive
- Mention technologies
- Show impact and scalability
    `;
  } else {
    prompt = `
Improve this resume content:

"${current}"

Make it professional and strong.
    `;
  }

  try {
    const res = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",

  messages: [
    {
      role: "system", // 👈 ADD THIS BLOCK (IMPORTANT)
      content: `
You are a senior FAANG-level resume expert.

Rules:
- Improve content professionally
- Add achievements
- Add metrics if possible
- Use strong action verbs
- Make ATS-friendly
Return ONLY improved text.
      `,
    },

    {
      role: "user",
      content: prompt, // 👈 your input stays here
    },
  ],
});

    return res.choices[0].message.content.trim();
  } catch (error) {
    console.log("Groq failed:", error.message);

    // 🚨 SAFE FALLBACK (never breaks UI)
    return current || "Unable to improve content right now.";
  }
}