import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

type FeedbackMetrics = {
    problemSolving?: string | number;
    systemDesign?: string | number;
    communicationSkills?: string | number;
    technicalAccuracy?: string | number;
    behavioralResponses?: string | number;
    timeManagement?: string | number;
    feedBack?: string; // summary text stored in nested object
};

function formatKey(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace("Feed Back", "Feedback");
}

export function FeedBackDialog({ feedBack, interviewtitle }: { feedBack: string | FeedbackMetrics; interviewtitle: string }) {
    const metrics: FeedbackMetrics | null = typeof feedBack === "object" && feedBack !== null ? feedBack : null;
    const summary = metrics?.feedBack || (typeof feedBack === "string" ? feedBack : "");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{interviewtitle}</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-3">
                            {summary && <p className="text-sm leading-relaxed">{summary}</p>}
                            {metrics && (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {Object.entries(metrics)
                                        .filter(([k]) => k !== "feedBack" && metrics[k as keyof FeedbackMetrics] !== undefined)
                                        .map(([k, v]) => (
                                            <li key={k}>
                                                <span className="font-medium">{formatKey(k)}:</span> {String(v)}
                                            </li>
                                        ))}
                                </ul>
                            )}
                            {!summary && !metrics && <p className="text-sm italic">No feedback available.</p>}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
