import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return Response.json(user);
  } catch (error) {
    return Response.json({
      error: "Failed",
    });
  }
}