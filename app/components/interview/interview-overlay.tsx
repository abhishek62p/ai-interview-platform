

import { useState, useEffect } from "react";
import { Mic, MicOff, Clock, Award, AlertCircle } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

type InterviewOverlayProps = {
    handleStartInterview: () => void;
}

const InterviewOverlay = ({ handleStartInterview }: InterviewOverlayProps) => {
    const [open, setOpen] = useState(true);
    const [micAccess, setMicAccess] = useState(false);
    const [micAccessAttempted, setMicAccessAttempted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showTips, setShowTips] = useState(false);

    const interviewTips = [
        "Speak clearly and at a moderate pace",
        "Take a brief pause before answering complex questions",
        "Maintain a positive attitude throughout"
    ];

    const handleMicPermission = async () => {

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicAccess(true);
            setMicAccessAttempted(true);
        } catch (error) {
            alert("Microphone access denied");
        }
    };

    const StartInterview = () => {
        setShowCountdown(true);
    };

    useEffect(() => {
        if (showCountdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setOpen(false);
        }
    }, [showCountdown, countdown]);

    useEffect(() => {
        if (!open) {
            handleStartInterview();
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={(event: any) => event.preventDefault()}
                onEscapeKeyDown={(event: any) => event.preventDefault()}
                className="sm:max-w-lg rounded-lg p-0 overflow-hidden border-none shadow-xl"
            >

                <div className="bg-[#5a5f7a] p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center">
                            <Award className="mr-2" size={24} />
                            Interview Session
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-[#e7e9fb] font-medium">
                            Get ready to showcase your skills and experience
                        </DialogDescription>
                    </DialogHeader>
                </div>


                <div className="p-6 bg-white">
                    {!showCountdown && (
                        <div className="space-y-6">

                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {micAccess ? (
                                            <Mic className="h-5 w-5 text-green-500 mr-2" />
                                        ) : (
                                            <MicOff className="h-5 w-5 text-slate-500 mr-2" />
                                        )}
                                        <span className="font-medium">Microphone Access</span>
                                    </div>
                                    <span
                                        className={`text-sm px-2 py-1 rounded-full ${micAccess
                                            ? "bg-green-100 text-green-800"
                                            : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {micAccess ? "Granted" : "Required"}
                                    </span>
                                </div>

                                {micAccessAttempted && !micAccess && (
                                    <div className="mt-3 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Microphone access denied. Please check browser permissions.
                                    </div>
                                )}
                            </div>


                            <div className="border border-indigo-100 rounded-lg overflow-hidden hover:">
                                <button
                                    onClick={() => setShowTips(!showTips)}
                                    className="w-full p-3 text-left cursor-pointer bg-[#e7e9fb] hover:bg-indigo-100 flex justify-between items-center"
                                >
                                    <span className="font-medium text-indigo-900">Quick Interview Tips</span>
                                    <span className="text-indigo-600 text-sm">
                                        {showTips ? "Hide" : "Show"}
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-500 ease-in-out  bg-white ${showTips ? 'max-h-96 p-4' : 'max-h-0 p-0'
                                        }`}
                                >
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                                        {interviewTips.map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>



                            <div className="text-sm text-[#5a5f7a] bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <strong>Note:</strong> Once started, the interview session cannot be paused or
                                stopped. Please ensure you're in a quiet environment and ready to proceed.
                            </div>


                            <div className="flex flex-col space-y-3">
                                {!micAccess ? (
                                    <Button
                                        onClick={handleMicPermission}
                                        className="w-full bg-[#5a5f7a] cursor-pointer hover:bg-[#2a314e] text-white py-3 rounded-lg flex items-center justify-center"
                                    >
                                        <Mic className="mr-2 h-4 w-4" />
                                        Allow Microphone Access
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={StartInterview}
                                        className="w-full bg-[#5a5f7a] cursor-pointer hover:bg-[#2a314e] text-white py-3 rounded-lg flex items-center justify-center"
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        I'm Ready to Start
                                    </Button>
                                )}

                            </div>
                        </div>
                    )}


                    {showCountdown && (
                        <div className="text-center py-6 space-y-4">
                            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-[#e7e9fb]"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-[#e7e9fb] animate-pulse"
                                    style={{
                                        clipPath: `circle(100% at center)`
                                    }}
                                ></div>
                                <span className="text-4xl font-bold text-[#1d243c]">{countdown}</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xl font-semibold text-slate-800">Interview starting soon...</p>
                                <p className="text-sm text-slate-600">
                                    Take a deep breath and get ready to shine!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewOverlay;