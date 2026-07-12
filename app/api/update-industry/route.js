import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const body = await req.json();
    const { industry } = body;

    if (!industry) {
      return Response.json({ error: "Industry required" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        industry,
      },
    });

    return Response.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.log(error);

    return Response.json({
      error: "Failed to update industry",
    }, { status: 500 });
  }
}