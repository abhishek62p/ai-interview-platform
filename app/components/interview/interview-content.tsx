"use client";

import React, { useState } from "react";
import InterviewOverlay from "./interview-overlay";
import InterviewCall from "./interview-call";
import { SavedMessage } from "./interview-body";

type InterviewContentProps = {
  data: any;
  conversation: SavedMessage[];
  setConversation: React.Dispatch<React.SetStateAction<SavedMessage[]>>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  noOfQuestions: number;
};

const InterviewContent = (props: InterviewContentProps) => {
  const [startInterview, setStartInterview] = useState(false);
  const handleStartInterview = () => setStartInterview(true);

  return (
    <>
      {!startInterview && (
        <InterviewOverlay handleStartInterview={handleStartInterview} />
      )}
      <InterviewCall
        startInterview={startInterview}
        InterViewData={props.data}
        setConversation={props.setConversation}
        conversation={props.conversation}
        setIsSubmitting={props.setIsSubmitting}
        noOfQuestions={props.data.noOfQuestions}
      />
    </>
  );
};

export default InterviewContent;
