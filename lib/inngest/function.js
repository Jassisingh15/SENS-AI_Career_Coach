import { inngest } from "./client";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights" },
  { event: "test/insights" },
  async () => {
    console.log("🔥 FUNCTION STARTED");

    try {
      const res = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: "Give short JSON about software industry",
          },
        ],
      });

      console.log("✅ AI RESPONSE:", res.choices[0].message.content);
    } catch (err) {
      console.error("❌ GROQ ERROR:", err.message);
    }

    return { success: true };
  }
);