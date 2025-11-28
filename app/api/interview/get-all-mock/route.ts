import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  try {
    const now = new Date();
    
    // Fetch all mock interviews created by anyone, not filtered by userId
    const interviews = await prisma.interview.findMany({
      where: {
        OR: [
          // Non-scheduled interviews (everyone can access)
          { isScheduled: false },
          // Scheduled interviews that haven't expired and are for this user
          {
            isScheduled: true,
            scheduledFor: session.user.email,
            expiresAt: { gt: now }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        type: true,
        role: true,
        difficultyLevel: true,
        isCompleted: true,
        createdAt: true,
        isScheduled: true,
        scheduledAt: true,
        expiresAt: true,
        scheduledFor: true,
        userId: true,
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
