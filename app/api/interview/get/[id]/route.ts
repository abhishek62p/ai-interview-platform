import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const interviewID = (await params)?.id;
  if (!interviewID) {
    return NextResponse.json({ error: "Missing interviewID" }, { status: 400 });
  }
  try {
    const interviews = await prisma.interview.findUnique({
      where: {
        id: interviewID,
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
