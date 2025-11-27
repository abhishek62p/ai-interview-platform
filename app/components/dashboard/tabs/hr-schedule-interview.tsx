"use client"

import { useState, useEffect } from "react"
import Image from "next/image";
import { useQuery } from "@tanstack/react-query"
import { FetchAllUsers } from "@/hooks/react-query/functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import Loader from "../../ui/loader"
import { toast } from "sonner"

export default function HrScheduleInterview() {
    const [candidateEmail, setCandidateEmail] = useState("")
    const [candidateName, setCandidateName] = useState("")
    const [interviewTitle, setInterviewTitle] = useState("")
    const [scheduledDate, setScheduledDate] = useState("")
    const [scheduledTime, setScheduledTime] = useState("")
    const [interviewType, setInterviewType] = useState("")
    const [techStack, setTechStack] = useState("")
    const [role, setRole] = useState("")
    const [experience, setExperience] = useState("")
    const [difficultyLevel, setDifficultyLevel] = useState("")
    const [noOfQuestions, setNoOfQuestions] = useState("5")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: candidates, isLoading } = useQuery({
        queryKey: ['users', 'all'],
        queryFn: FetchAllUsers
    })

    // Pre-fill form from sessionStorage (when coming from Schedule button)
    useEffect(() => {
        const candidateData = sessionStorage.getItem('scheduleCandidate')
        if (candidateData) {
            try {
                const { email, name } = JSON.parse(candidateData)
                if (email) setCandidateEmail(email)
                if (name) setCandidateName(name)
                // Clear after reading
                sessionStorage.removeItem('scheduleCandidate')
            } catch (e) {
                console.error('Failed to parse candidate data:', e)
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!candidateEmail || !interviewTitle || !scheduledDate || !scheduledTime) {
            toast.error("Please fill all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
            const expirationDateTime = new Date(scheduledDateTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours later

            const response = await fetch('/api/interview/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateEmail,
                    interviewTitle,
                    scheduledAt: scheduledDateTime.toISOString(),
                    expiresAt: expirationDateTime.toISOString(),
                    type: interviewType,
                    techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
                    role,
                    experience,
                    difficultyLevel,
                    noOfQuestions: parseInt(noOfQuestions)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to schedule interview')
            }

            toast.success("Interview scheduled successfully!")
            
            // Reset form
            setCandidateEmail("")
            setCandidateName("")
            setInterviewTitle("")
            setScheduledDate("")
            setScheduledTime("")
            setInterviewType("")
            setTechStack("")
            setRole("")
            setExperience("")
            setDifficultyLevel("")
            setNoOfQuestions("5")

        } catch (error: any) {
            toast.error(error.message || "Failed to schedule interview")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center bg-white/60 z-10 p-5 rounded-4xl flex-1 w-full gap-10 justify-around">
                <Card className="flex flex-col w-full max-w-4xl z-50 p-4 bg-white rounded-4xl">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-dark text-xl md:text-2xl text-center md:text-left">Schedule Interview</CardTitle>
                        <CardDescription className="text-sm mt-2">Schedule an interview for a candidate with specific date and time. The interview will expire 24 hours after the scheduled time.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Candidate Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="candidateEmail">Candidate Email *</Label>
                                <Input
                                    id="candidateEmail"
                                    type="email"
                                    value={candidateEmail}
                                    onChange={(e) => setCandidateEmail(e.target.value)}
                                    placeholder="Enter or auto-filled from selection"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="candidateName">Candidate Name *</Label>
                                <Input
                                    id="candidateName"
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                    placeholder="Enter or auto-filled from selection"
                                    required
                                />
                            </div>
                        </div>

                        {/* Quick Select Candidate */}
                        <div className="space-y-2">
                            <Label htmlFor="quickSelect">Quick Select Candidate (Optional)</Label>
                            <Select 
                                value="" 
                                onValueChange={(value) => {
                                    const candidate = candidates?.find((c: any) => c.id === value)
                                    if (candidate) {
                                        setCandidateEmail(candidate.email)
                                        setCandidateName(candidate.name || "")
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select from registered candidates" />
                                </SelectTrigger>
                                <SelectContent>
                                    {candidates?.map((candidate: any) => (
                                        <SelectItem key={candidate.id} value={candidate.id}>
                                            {candidate.name} ({candidate.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Interview Details */}
                        <div className="space-y-2">
                            <Label htmlFor="interviewTitle">Interview Title *</Label>
                            <Input
                                id="interviewTitle"
                                value={interviewTitle}
                                onChange={(e) => setInterviewTitle(e.target.value)}
                                placeholder="e.g., Frontend Developer Interview"
                                required
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                                <Input
                                    id="scheduledDate"
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                                <Input
                                    id="scheduledTime"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Interview Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Interview Type</Label>
                                <Select value={interviewType} onValueChange={setInterviewType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technical">Technical</SelectItem>
                                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                                        <SelectItem value="System Design">System Design</SelectItem>
                                        <SelectItem value="HR Round">HR Round</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g., Frontend Developer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                            <Input
                                id="techStack"
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                                placeholder="e.g., React, Node.js, TypeScript"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience Level</Label>
                                <Select value={experience} onValueChange={setExperience}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-2 years">0-2 years</SelectItem>
                                        <SelectItem value="2-5 years">2-5 years</SelectItem>
                                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                                        <SelectItem value="10+ years">10+ years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="noOfQuestions">Number of Questions</Label>
                                <Input
                                    id="noOfQuestions"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={noOfQuestions}
                                    onChange={(e) => setNoOfQuestions(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setCandidateEmail("")
                                    setCandidateName("")
                                    setInterviewTitle("")
                                    setScheduledDate("")
                                    setScheduledTime("")
                                }}
                            >
                                Clear
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Scheduling..." : "Schedule Interview"}
                            </Button>
                        </div>
                    </form>
                    </CardContent>
                </Card>
                <Image src={"typing-bro.svg"} className='hidden lg:block z-100 w-full min-w-xs max-w-md' height={360} width={360} alt='typing'/>
            </div>
        </div>
    )
}
