import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userRole = session?.user?.role;

  // Only HR can access this endpoint
  if (!session || userRole !== "HR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const interviews = await prisma.interview.findMany({
      where: {
        isCompleted: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        role: true,
        difficultyLevel: true,
        isCompleted: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        feedBack: {
          select: {
            problemSolving: true,
            systemDesign: true,
            communicationSkills: true,
            technicalAccuracy: true,
            behavioralResponses: true,
            timeManagement: true,
            feedBack: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
