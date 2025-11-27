"use client";

import React, { useState } from 'react'
import InterviewOverlay from './interview-overlay';
import InterviewCall from './interview-call';


type InterviewContentProps = {
    data: any
}

const InterviewContent = ({ data }: InterviewContentProps) => {
    const [startInterview, setStartInterview] = useState(false);
    const handleStartInterview = () => setStartInterview(true);

    return (
        <>
            {!startInterview && <InterviewOverlay handleStartInterview={handleStartInterview} />}
            <InterviewCall startInterview={startInterview} InterViewData={data} />
        </>

    )
}

export default InterviewContent