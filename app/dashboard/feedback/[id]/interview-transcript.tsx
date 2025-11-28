"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { MessageSquare, User } from "lucide-react";

interface SavedMessage {
  role: "assistant" | "user";
  content: string;
}

const InterviewTranscript = ({
  conversation,
}: {
  conversation: SavedMessage[];
}) => {
  const cleaned = useMemo(() => conversation || [], [conversation]);

  return (
    <Card className="bg-white/70 border border-black/10 shadow-lg backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-dark flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-dark/80" />
          Interview Transcript
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
          {cleaned.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={index}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-xl items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  {!isUser && (
                    <div className="p-2 bg-white rounded-full shadow-sm ring-1 ring-black/5">
                      <User className="w-5 h-5 text-dark/70" />
                    </div>
                  )}
                  <div
                    className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border border-black/5 ${
                      isUser
                        ? "bg-green/20 text-dark"
                        : "bg-white/80 text-dark/90"
                    }`}
                  >
                    {message.content}
                    <span className="absolute -bottom-5 left-4 text-[10px] uppercase tracking-wide text-dark/30 group-hover:text-dark/50">
                      {isUser ? "You" : "Assistant"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {cleaned.length === 0 && (
            <p className="text-sm text-dark/50">No transcript available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewTranscript;
