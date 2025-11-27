import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Phone, PhoneOff } from 'lucide-react'
import { boolean } from 'zod';

interface InterviewFooterProps {
    Message: string,
    HangUpFunction: (hangUp: Boolean) => void;
}


const InterviewFooter = ({ Message, HangUpFunction }: InterviewFooterProps) => {

    const [isMessagePassed, setIsMessagePassed] = useState(false);

    useEffect(() => {
        if (!isMessagePassed && Message.length) {
            setIsMessagePassed(true);
        }
    }, [Message]);

    return (
        <article className='flex flex-row items-center justify-center p-0 gap-5 w-full'>
            <div className={`${isMessagePassed ? '' : 'animate-pulse'} text-center min-w-[50%] max-w-[80%] bg-dark/20 py-2 rounded-4xl transition-all duration-200`}>
                {Message}
            </div>
            <Button onClick={() => HangUpFunction(true)} className='bg-red-600 px-3 py-1.5 pointer cursor-auto self-center rounded-4xl'>
                Hang Up
            </Button>
        </article>
    )
}

export default InterviewFooter