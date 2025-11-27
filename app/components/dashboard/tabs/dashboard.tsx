import React, { Suspense } from 'react'
import { InterviewProgressChart } from '../interview-progress-chart'
import DashboardTabHeader from '../dashboard-tab-header'
import { SkillsPerformanceChart } from '../skill-performance-chart'
import LeaderBoard from '../leader-board'
import { prisma } from '@/prisma/prisma'
import { auth } from '@/app/(auth-pages)/auth'
import Loader from '../../ui/loader'
import ScheduledInterviewsTable from '../scheduled-interviews-table'
import { Card, CardContent, CardHeader } from '../../ui/card'

const DashboardTab = async () => {
  const user = await auth();
  const isHR = user?.user?.role === 'HR';

  // For HR, show scheduled interviews
  if (isHR) {
    return (
      <Suspense fallback={<Loader />}>
        <Card className="flex border-none h-full gap-0 bg-[#c1cbef] z-10 pt-0 px-0 rounded-4xl pb-0 w-full">
          <CardHeader className="flex py-4 justify-between flex-row items-center">
            <h2 className="text-lg sm:text-xl font-semibold px-4">My Scheduled Interviews</h2>
          </CardHeader>
          <CardContent className="w-full h-full py-0 px-0">
            <ScheduledInterviewsTable />
          </CardContent>
        </Card>
      </Suspense>
    )
  }

  // For candidates, show existing dashboard
  let Data = null;
  try {
    if (user?.user?.id) {
      Data = await prisma.user.findFirst({
        where: {
          id: user.user.id
        },
        include: {
          interviews: true,
          feedBack: true
        }
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Data will remain null, and we'll use default values
  }

  const totalInterViews: number = Data?.interviews?.length ?? 0;
  const completedInterViews: number = Data?.interviews?.filter((x) => x.isCompleted == true).length ?? 0;
  const inProgressInterViews: number = Data?.interviews?.filter((x) => x.isCompleted != true).length ?? 0;

  // Safely calculate chart data with fallbacks
  const feedbackData = Data?.feedBack ?? [];
  const chartData = [
    { type: "Problem Solving", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.problemSolving, 0) : 0 },
    { type: "System Design", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.systemDesign, 0) : 0 },
    { type: "Communication Skills", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.communicationSkills, 0) : 0 },
    { type: "Technical Accuracy", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.technicalAccuracy, 0) : 0 },
    { type: "Behavioral Responses", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.behavioralResponses, 0) : 0 },
    { type: "Time Management", value: feedbackData.length > 0 ? feedbackData.reduce((a, b) => a + b.timeManagement, 0) : 0 },
  ]

  return (
    <Suspense fallback={<Loader />}>
      <div className='w-full flex flex-col gap-5 pb-10 xl:pb-0 overflow-auto md:overflow-y-none'>
        <div>
          <DashboardTabHeader completedInterViews={completedInterViews} totalInterViews={inProgressInterViews} />
        </div>
        <div className='flex flex-col xl:flex-row gap-y-5 gap-x-1.5'>
          <InterviewProgressChart CompletedInterviews={totalInterViews} inProgress={inProgressInterViews} />
          <SkillsPerformanceChart ChartData={chartData} />
          <LeaderBoard />
        </div>
      </div>
    </Suspense>

  )
}

export default DashboardTab