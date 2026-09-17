import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${clerkUser.firstName} ${clerkUser.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
