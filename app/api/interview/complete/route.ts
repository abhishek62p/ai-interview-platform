import { SavedMessage } from "@/app/components/interview/interview-body";
import { prisma } from "@/prisma/prisma";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const completeInterviewSchema = z.object({
  id: z.string(),
  userid: z.string(),
  conversation: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  codingProblem: z.string().optional(),
  submittedCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env" },
      { status: 500 }
    );
  }
  const body = await req.json();

  const validation = completeInterviewSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Invalid request body", error: validation.error.issues },
      { status: 400 }
    );
  }

  const conversationText = (body.conversation as SavedMessage[])
    .map(
      (msg) =>
        `${msg.role.toLocaleLowerCase() === "user" ? "User" : "Assistant"}: ${
          msg.content
        }`
    )
    .join("\n");
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
              Evaluate the user’s performance in the interview.
              ${conversationText}
              If the conversation is too short, lacks meaningful questions return exactly this:
              {}
              If the conversation is valid, analyze the transcript to identify the 2-3 most important technical topics the candidate struggled with. For each topic, find one high-quality learning resource (a video, article, or official documentation). Then, return a single valid JSON object with the following structure:
              {
                  "feedbackObject": "A concise summary (350–400 characters) highlighting performance and areas of improvement.",
                  "ProblemSolving": <1–100>,
                  "SystemDesign": <1–100>,
                  "CommunicationSkills": <1–100>,
                  "TechnicalAccuracy": <1–100>,
                  "BehavioralResponses": <1–100>, // Rate based on professionalism and clarity, not personality.
                  "TimeManagement": <1–100>,
                  "weakTopics": [
                    {
                      "topic": "The specific technical topic",
                      "resourceType": "video" | "article" | "docs",
                      "resourceTitle": "Title of the resource",
                      "resourceUrl": "A valid URL to the resource"
                    }
                  ]
              }

              ❗ STRICT RULES:
              Don't start with json in the results
              Do NOT include any markdown, triple backticks, or code blocks
              Do NOT include any text, labels, commentary, or variable names before or after the JSON
              Do NOT escape characters (e.g., no \n or \")
              Do NOT wrap the output in quotes
              Return only the raw JSON object as shown above — nothing else
              If the interview is invalid, return exactly: {}
`,
    });
    const feedbackObject = JSON.parse(
      text.replace(/^```json\n|```$/g, "").trim()
    );

    if (Object.keys(feedbackObject).length === 0) {
      return NextResponse.json(
        { message: "Interview conversation is too short or invalid." },
        { status: 400 }
      );
    }

    console.log("[API] AI Model Output (feedbackObject):", feedbackObject);

    // Prepare the data object that maps directly to your InterviewFeedback table columns.
    const feedbackDataForDb = {
      userId: body.userid,
      feedBack: JSON.stringify({
        summary: feedbackObject.feedbackObject,
        transcript: body.conversation,
        weakTopics: feedbackObject.weakTopics,
      }),
      problemSolving: feedbackObject.ProblemSolving,
      systemDesign: feedbackObject.SystemDesign,
      communicationSkills: feedbackObject.CommunicationSkills,
      technicalAccuracy: feedbackObject.TechnicalAccuracy,
      behavioralResponses: feedbackObject.BehavioralResponses,
      timeManagement: feedbackObject.TimeManagement,
    };

    await prisma.interview.update({
      where: { id: body.id, userId: body.userid },
      data: {
        isCompleted: true,
        feedBack: { create: feedbackDataForDb },
      },
    });

    return NextResponse.json({
      status: 200,
      interviewId: body.id,
      message: "Interview completed and feedback saved.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Failed to parse AI model response." },
        { status: 500 }
      );
    }

    console.error("Error completing interview:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
