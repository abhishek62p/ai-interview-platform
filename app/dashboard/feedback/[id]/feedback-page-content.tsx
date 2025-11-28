"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  BrainCircuit,
  MessageSquare,
  Target,
  Timer,
  Users,
  Layout,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tooltip } from "@/app/components/ui/tooltip";
import InterviewTranscript from "./interview-transcript";
import PersonalizedLearningPath from "./learning-path";
import { toast } from "sonner";
import Link from "next/link";
import { InterviewFeedback } from "@prisma/client";

interface FeedbackPageProps {
  feedback: InterviewFeedback & {
    interview: { name: string; role: string } | null;
  };
}

const FeedbackPageContent: React.FC<FeedbackPageProps> = ({ feedback }) => {
  // 1. Log the entire object received from the backend.
  console.log("[FE] Full 'feedback' prop received:", feedback);

  let parsedFeedback;
  try {
    // 2. The 'feedBack' column (with a capital 'B') contains the JSON string.
    parsedFeedback = JSON.parse(feedback.feedBack as string);
    console.log(
      "[FE] Successfully parsed 'feedback.feedBack':",
      parsedFeedback
    );
  } catch (error) {
    console.log(
      "[FE] Content of 'feedback.feedBack' that failed to parse:",
      feedback.feedBack
    );
    // This fallback handles old data where 'feedBack' was just a plain string.
    parsedFeedback = {
      summary: feedback.feedBack,
      transcript: [],
      weakTopics: [],
    };
  }

  const scores = [
    {
      name: "Problem Solving",
      value: feedback.problemSolving,
      Icon: BrainCircuit,
    },
    { name: "System Design", value: feedback.systemDesign, Icon: Layout },
    {
      name: "Communication Skills",
      value: feedback.communicationSkills,
      Icon: MessageSquare,
    },
    {
      name: "Technical Accuracy",
      value: feedback.technicalAccuracy,
      Icon: Target,
    },
    {
      name: "Behavioral Responses",
      value: feedback.behavioralResponses,
      Icon: Users,
    },
    { name: "Time Management", value: feedback.timeManagement, Icon: Timer },
  ];

  const overallScore = Math.round(
    scores.reduce((acc, score) => acc + score.value, 0) / scores.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return "bg-green";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  const handleCopySummary = useCallback(() => {
    try {
      const text = parsedFeedback.summary || "";
      navigator.clipboard?.writeText(text);
      toast.success("Summary copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy summary");
    }
  }, [parsedFeedback.summary]);

  const handleDownloadJSON = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(parsedFeedback, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-feedback-${feedback.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Feedback JSON downloaded");
    } catch (e) {
      toast.error("Failed to download file");
    }
  }, [parsedFeedback, feedback.id]);

  const summaryParagraphs = useMemo(() => {
    if (!parsedFeedback.summary) return [];
    return String(parsedFeedback.summary)
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean);
  }, [parsedFeedback.summary]);

  return (
    <div className="relative z-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-white/70 backdrop-blur-md border border-black/10 rounded-4xl shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 via-transparent to-green-50/30 pointer-events-none" />
          <CardContent className="p-8 text-dark relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-dark/70 text-sm font-medium mb-2">
                  Interview Feedback Report
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-dark">
                  {feedback.interview?.name || "Interview"}
                </h1>
                <p className="text-dark/80 text-lg">
                  {feedback.interview?.role}
                </p>
              </div>
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-3xl p-4 min-w-[180px] shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-dark/80" />
                  <span className="text-xs font-medium text-dark uppercase tracking-wide">Overall Score</span>
                </div>
                <div className="relative w-32 h-32">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(var(--progress-color) ${overallScore * 3.6}deg, #e5e7eb 0deg)`,
                      ['--progress-color' as any]: overallScore >= 75 ? '#10b981' : overallScore >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                  <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-dark">{overallScore}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-dark/60">out of 100</div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={handleCopySummary}>Copy Summary</Button>
                  <Button size="sm" variant="outline" onClick={handleDownloadJSON}>Download JSON</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-dark/80" />
            <h2 className="text-2xl font-bold text-dark">
              Performance Breakdown
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {scores.map(({ name, value, Icon }) => {
              const colorClass = getScoreColor(value);
              return (
                <Card
                  key={name}
                  className="relative group bg-white/70 border border-black/10 backdrop-blur-md transition-all hover:shadow-xl overflow-hidden rounded-3xl"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-indigo-50 via-transparent to-green-100" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform">
                        <Icon className={`w-6 h-6 ${colorClass}`} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
                        <span className="text-[10px] mt-1 uppercase tracking-wide text-dark/40">score</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-dark text-sm flex items-center gap-2">
                      {name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-dark/60">
                        {value >= 75 ? 'Strong' : value >= 50 ? 'Moderate' : 'Needs Work'}
                      </span>
                    </h3>
                    <div className="mt-4 w-full bg-black/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="bg-white/70 border border-black/10 shadow-lg backdrop-blur-md">
          <CardHeader className="pb-3 space-y-2">
            <CardTitle className="text-2xl font-bold text-dark flex flex-wrap items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm ring-1 ring-black/5">
                <BrainCircuit className="w-6 h-6 text-dark/80" />
              </div>
              AI-Generated Insights & Recommendations
            </CardTitle>
            {parsedFeedback.weakTopics && parsedFeedback.weakTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {parsedFeedback.weakTopics.map((t: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-200 shadow-sm"
                  >
                    {t.topic || t}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {summaryParagraphs.length === 0 && (
              <p className="text-dark/70 text-sm">No summary available.</p>
            )}
            {summaryParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-dark/80 leading-relaxed text-base bg-white/60 rounded-xl p-4 shadow-sm border border-black/5"
              >
                {para}
              </p>
            ))}
          </CardContent>
        </Card>

        <InterviewTranscript conversation={parsedFeedback.transcript || []} />
        {parsedFeedback.weakTopics && (
          <PersonalizedLearningPath topics={parsedFeedback.weakTopics} />
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="primary-button bg-green text-white shadow-lg cursor-pointer"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPageContent;
