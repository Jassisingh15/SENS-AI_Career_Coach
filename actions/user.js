"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

/* ================= UPDATE USER ================= */
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. check industry insight
      let industryInsight = await tx.industryInsight.findUnique({
        where: {
          industry: data.industry,
        },
      });

      // 2. create if not exists
      if (!industryInsight) {
        let insights;

        try {
          insights = await generateAIInsights(data.industry);
        } catch (error) {
          console.log("AI insights failed, using fallback");

          // 🚨 fallback (so onboarding never breaks)
          insights = {
            salaryRanges: [
              {
                role: "Software Engineer",
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

        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      // 3. update user
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    });

    revalidatePath("/dashboard");
    return { success: true, data: result.updatedUser };
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile");
  }
}

/* ================= ONBOARDING STATUS ================= */
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
