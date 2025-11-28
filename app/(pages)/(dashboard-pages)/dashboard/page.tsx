import DashboardTab from "@/app/components/dashboard/tabs/dashboard";
import CreateInterviewTab from "@/app/components/dashboard/tabs/create-interview";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import React from "react";
import MockInterviewTab from "@/app/components/dashboard/tabs/mock-interview";
import InterviewHistory from "@/app/components/dashboard/tabs/interview-history";
import HRUsersTab from "@/app/components/dashboard/tabs/hr-users";
import HRReportsTab from "@/app/components/dashboard/tabs/hr-reports";
import HrScheduleInterview from "@/app/components/dashboard/tabs/hr-schedule-interview";
import Link from "next/link";
import HRDashboardTab from "@/app/components/dashboard/tabs/hr-dashboard";
import { auth } from "@/app/(auth-pages)/auth";
import { getDashboardData, getHRDashboardData } from "@/app/dashboard/actions";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  // If no session, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  const isHR = session.user.role === "HR";

  // Fetch data based on user role
  const dashboardData = isHR
    ? await getHRDashboardData()
    : await getDashboardData();

  return (
    <div className=" z-50">
      {isHR ? (
        <>
          <TabsContent value="dashboard">
            <HRDashboardTab
              stats={(dashboardData as any).stats}
              recentInterviews={(dashboardData as any).recentInterviews}
              scheduledCandidates={(dashboardData as any).scheduledCandidates}
            />
          </TabsContent>
          <TabsContent value="hr_users">
            <HRUsersTab />
          </TabsContent>
          <TabsContent value="hr_schedule">
            <HrScheduleInterview />
          </TabsContent>
          <TabsContent value="hr_reports">
            <HRReportsTab />
          </TabsContent>
        </>
      ) : (
        <>
          <TabsContent value="dashboard">
            <DashboardTab // This is for regular users
              completedInterViews={
                (dashboardData as any).completedInterviewsCount
              }
              totalInterViews={(dashboardData as any).totalInterviews}
              averageScore={(dashboardData as any).averageScore}
              skillsData={(dashboardData as any).skillsData}
            />
          </TabsContent>
          <TabsContent value="live_interviews">
            <MockInterviewTab />
          </TabsContent>
          <TabsContent className="mb-4" value="mock_interviews">
            <MockInterviewTab />
          </TabsContent>
          <TabsContent value="create_interview">
            <CreateInterviewTab />
          </TabsContent>
          <TabsContent value="interview_history">
            <InterviewHistory />
          </TabsContent>
        </>
      )}
    </div>
  );
};

export default page;
