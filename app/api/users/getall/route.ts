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
    const users = await prisma.user.findMany({
      where: {
        role: "CANDIDATE", // Only fetch candidates
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        interviews: {
          select: {
            id: true,
            isCompleted: true,
            feedBack: {
              select: {
                problemSolving: true,
                systemDesign: true,
                communicationSkills: true,
                technicalAccuracy: true,
                behavioralResponses: true,
                timeManagement: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats for each user
    const usersWithStats = users.map(user => {
      const completedInterviews = user.interviews.filter(i => i.isCompleted && i.feedBack);
      const totalInterviews = user.interviews.length;
      
      let averageScore = 0;
      if (completedInterviews.length > 0) {
        const totalScore = completedInterviews.reduce((sum, interview) => {
          if (interview.feedBack) {
            const fb = interview.feedBack;
            const interviewAvg = (
              fb.problemSolving +
              fb.systemDesign +
              fb.communicationSkills +
              fb.technicalAccuracy +
              fb.behavioralResponses +
              fb.timeManagement
            ) / 6;
            return sum + interviewAvg;
          }
          return sum;
        }, 0);
        averageScore = Math.round(totalScore / completedInterviews.length);
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        totalInterviews,
        completedInterviews: completedInterviews.length,
        averageScore,
      };
    });

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
