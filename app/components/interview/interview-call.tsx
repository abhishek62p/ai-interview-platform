import React, { use, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import InterviewHeader from './interview-header'
import InterviewBody from './interview-body'
import InterviewFooter from './interview-footer'

interface InterviewProps {
    InterViewData: any,
    startInterview: boolean,
}


const InterviewCall = ({ InterViewData, startInterview }: InterviewProps) => {

    const [currentmessage, setCurrentmessage] = useState("");
    const [isHangingUp, setIsHangingUp] = React.useState(false);
    
    const handleLastMessageChange = (message: string) => {
        setCurrentmessage(message);
    }

    const handleHangUp = () => {
        setIsHangingUp(true);
    }

    return (
        <Card className='h-full w-full py-4 px-0 bg-transparent border-none shadow-none'>
            <CardHeader>
                <InterviewHeader {...InterViewData} />
            </CardHeader>
            <CardContent className='px-0 z-20'>
                <InterviewBody {...InterViewData} startInterview={startInterview} handleLastMessageChange={handleLastMessageChange} isHangingUp={isHangingUp} />
            </CardContent>
            <InterviewFooter Message={currentmessage} HangUpFunction={handleHangUp} />
        </Card>
    )
}

export default InterviewCall