import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'HR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    const interviews = await prisma.interview.findMany({
      where: { 
        isScheduled: true,
        scheduledBy: session.user.id // Filter by logged-in HR
      },
      orderBy: { scheduledAt: 'desc' },
      select: {
        id: true,
        name: true,
        scheduledAt: true,
        expiresAt: true,
        isCompleted: true,
        user: { select: { name: true, email: true } }
      }
    });

    const withStatus = interviews.map(iv => {
      const expired = iv.expiresAt ? iv.expiresAt < now : false;
      let status: 'COMPLETED' | 'EXPIRED' | 'PENDING' = 'PENDING';
      if (iv.isCompleted) status = 'COMPLETED';
      else if (!iv.isCompleted && expired) status = 'EXPIRED';
      return { ...iv, status };
    });

    return NextResponse.json(withStatus, { status: 200 });
  } catch (e: any) {
    console.error('Error fetching scheduled interviews', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
