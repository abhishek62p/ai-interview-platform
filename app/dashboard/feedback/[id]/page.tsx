import React from "react";
import { getInterviewFeedback } from "@/app/dashboard/actions";
import FeedbackPageContent from "./feedback-page-content";

// Next.js 15 dynamic params are async; await before use
export default async function InterviewFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let feedback;
  let error = null;

  try {
    feedback = await getInterviewFeedback(id);
    if (!feedback) {
      error = "Could not find the requested feedback report.";
    }
  } catch (err) {
    console.error("Failed to fetch feedback:", err);
    error = "Failed to load feedback report. The link may be invalid.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 p-4 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[10%] translate-y-[20%] bg-[#898da5] brightness-200 rounded-full opacity-50 blur-[80px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[220%] translate-y-[30%] bg-[#5a5f7a] brightness-200 rounded-full opacity-50 blur-[80px]" />
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      {!error && feedback && <FeedbackPageContent feedback={feedback} />}
    </div>
  );
}
