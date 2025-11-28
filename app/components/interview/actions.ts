"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/(auth-pages)/auth"; // Adjust this import to your actual auth file
import { prisma } from "@/prisma/prisma";

export async function getCompletedInterviews() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const interviews = await prisma.interview.findMany({
    where: {
      userId: session.user.id,
      isCompleted: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return interviews;
}

export async function handleCreateInterviewFormAction(
  previousState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  try {
    const data = {
      userId: session.user.id,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      role: formData.get("role") as string,
      techStack: (formData.get("techStack") as string)
        .split(",")
        .map((t) => t.trim()),
      experience: formData.get("experience") as string,
      difficultyLevel: formData.get("difficultyLevel") as string,
      noOfQuestions: parseInt(formData.get("numberOfQuestions") as string, 10),
    };

    await prisma.interview.create({
      data: {
        ...data,
        isCompleted: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create interview:", error);
    return { success: false, message: "Failed to create interview." };
  }
}
