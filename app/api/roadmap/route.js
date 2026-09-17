import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { groq } from "@/lib/groq";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are an expert FAANG-level career mentor.

Generate a REALISTIC, PRACTICAL career roadmap.

GOAL:
Create a natural learning-to-job journey based on user profile.

IMPORTANT:
Do NOT force any stage on a fixed week number.
Instead, decide progression based on logic:
- Beginners start with basics
- Then skills
- Then projects
- Then internships/job prep when appropriate

RULES:
- Duration: 2 to 4 months
- Each month has 4 weeks
- Each week must have:
  - Clear heading
  - 3–5 meaningful tasks
  - Practical learning + real-world actions when relevant

CAREER FLOW (USE FLEXIBLY, NOT FIXED ORDER):
Learning → Practice → Projects → Portfolio → Internship Applications → Job Preparation → Job Applications

YOU MAY INCLUDE WHEN APPROPRIATE:
- Building projects
- GitHub portfolio setup
- Resume preparation
- LinkedIn optimization
- Internship applications
- Interview preparation
- Job applications

FORMAT:

MONTH 1: Foundations
Week 1: Basics of [Field]
- Learn core fundamentals
- Understand key concepts
- Practice beginner exercises
- Small practice task

Week 2: Skill Building
- Learn core skills
- Solve practice problems
- Start coding exercises
- Mini project work

Week 3: Project Development
- Build real project
- Improve logic and structure
- Add features
- Test and refine

Week 4: Career Preparation Start
- Build GitHub portfolio
- Improve resume
- Explore internship opportunities
- Start LinkedIn profile

MONTH 2: Growth & Career Readiness
Week 1: Advanced Learning
- Learn intermediate topics
- Improve project quality
- Add advanced features

Week 2: Internship Readiness
- Apply for internships
- Improve resume and LinkedIn
- Prepare introduction pitch

Week 3: Interview Preparation
- Practice interview questions
- Basic DSA / technical prep
- Mock interviews

Week 4: Job Applications
- Apply for entry-level jobs
- Improve portfolio
- Final resume optimization

User Info:
Industry: ${user.industry}
Skills: ${user.skills?.join(", ")}
Experience: ${user.experience}

Return ONLY roadmap.
`,
        },
        {
          role: "user",
          content: `
Generate a personalized career roadmap.

User Details:
Industry: ${user.industry}
Skills: ${user.skills?.join(", ")}
Experience: ${user.experience}
          `,
        },
      ],
    });

    const roadmap = completion.choices[0].message.content;

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error("Roadmap API Error:", error);

    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 },
    );
  }
}
