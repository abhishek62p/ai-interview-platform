import InterviewCall from '@/app/components/interview/interview-call';
import InterviewContent from '@/app/components/interview/interview-content';
import InterviewOverlay from '@/app/components/interview/interview-overlay';
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: interviewId } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/get/${interviewId}`)
  const data = await response.json();
  console.log(data);
  return (
      <InterviewContent {...data} />
  );
}