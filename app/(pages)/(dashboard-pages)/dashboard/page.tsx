import DashboardTab from "@/app/components/dashboard/tabs/dashboard";
import CreateInterviewTab from "@/app/components/dashboard/tabs/create-interview";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import React from "react";
import MockInterviewTab from "@/app/components/dashboard/tabs/mock-interview";
import InterviewHistory from "@/app/components/dashboard/tabs/interview-history";
import HRUsersTab from "@/app/components/dashboard/tabs/hr-users";
import HRReportsTab from "@/app/components/dashboard/tabs/hr-reports";
import HrScheduleInterview from "@/app/components/dashboard/tabs/hr-schedule-interview";
import { auth } from "@/app/(auth-pages)/auth";

const page = async () => {
  const session = await auth();
  const isHR = session?.user?.role === "HR";

  return (
    <div className=" z-50">
      {isHR ? (
        <>
          <TabsContent value="dashboard">
            <DashboardTab />
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
            <DashboardTab />
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
