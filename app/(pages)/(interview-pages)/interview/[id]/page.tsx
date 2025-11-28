"use client";

import InterviewContent from "@/app/components/interview/interview-content";
import { SavedMessage } from "@/app/components/interview/interview-body"; // Assuming this is where the type is defined
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Loader from "@/app/components/ui/loader";

// Adapt to Next.js 15 async params using React use() to unwrap
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState<any>(null);
  const [conversation, setConversation] = useState<SavedMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/get/${id}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch interview details. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setInterviewData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    if (id) {
      fetchInterviewData();
    }
  }, [id]);

  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!interviewData || isSubmitting) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Loader />
        <p className="text-lg">
          {isSubmitting
            ? "Generating your feedback, please wait..."
            : "Loading Interview..."}
        </p>
      </div>
    );
  }

  return (
    <InterviewContent
      data={interviewData}
      setConversation={setConversation}
      conversation={conversation}
      setIsSubmitting={setIsSubmitting}
      noOfQuestions={interviewData.noOfQuestions}
    />
  );
}
