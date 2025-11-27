import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { sendInterviewScheduledEmail } from "@/app/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Only HR can schedule interviews
        if (session.user.role !== "HR") {
            return NextResponse.json(
                { error: "Only HR can schedule interviews" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const {
            candidateEmail,
            interviewTitle,
            scheduledAt,
            expiresAt,
            type,
            techStack,
            role,
            experience,
            difficultyLevel,
            noOfQuestions
        } = body;

        // Validate required fields
        if (!candidateEmail || !interviewTitle || !scheduledAt || !expiresAt) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find candidate by email
        const candidate = await prisma.user.findUnique({
            where: { email: candidateEmail }
        });

        if (!candidate) {
            return NextResponse.json(
                { error: "Candidate not found" },
                { status: 404 }
            );
        }

        if (candidate.role !== "CANDIDATE") {
            return NextResponse.json(
                { error: "Selected user is not a candidate" },
                { status: 400 }
            );
        }

        // Create scheduled interview
        const interview = await prisma.interview.create({
            data: {
                name: interviewTitle,
                userId: candidate.id,
                type: type || "Technical",
                techStack: techStack || [],
                role: role || "",
                experience: experience || "",
                difficultyLevel: difficultyLevel || "Medium",
                noOfQuestions: noOfQuestions || 5,
                questions: [],
                isScheduled: true,
                scheduledBy: session.user.id || "",
                scheduledFor: candidateEmail,
                scheduledAt: new Date(scheduledAt),
                expiresAt: new Date(expiresAt),
                isCompleted: false
            }
        });

        // Fire-and-forget email notification (non-blocking response)
        (async () => {
            try {
                await sendInterviewScheduledEmail({
                    to: candidateEmail,
                    candidateName: candidate.name,
                    interviewTitle,
                    scheduledAt: new Date(scheduledAt),
                    expiresAt: new Date(expiresAt),
                    hrName: session.user.name || null
                });
            } catch (e) {
                console.error("Email notification failed:", e);
            }
        })();

        return NextResponse.json({
            success: true,
            interview
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error scheduling interview:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
