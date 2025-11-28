import React from "react";
import { InterviewProgressChart } from "../interview-progress-chart";
import DashboardTabHeader from "../dashboard-tab-header";
import { SkillsPerformanceChart } from "../skill-performance-chart";
import LeaderBoard from "../leader-board";

type DashboardTabProps = {
  completedInterViews?: number;
  totalInterViews?: number;
  averageScore?: number;
  skillsData?: any[];
};

const DashboardTab = ({
  completedInterViews,
  totalInterViews,
  averageScore,
  skillsData,
}: DashboardTabProps) => {
  return (
    <div className="w-full flex flex-col gap-5 pb-10 xl:pb-0 overflow-auto md:overflow-y-none">
      <div>
        <DashboardTabHeader
          completedInterViews={completedInterViews}
          totalInterViews={totalInterViews}
          averageScore={averageScore}
        />
      </div>
      <div className="flex flex-col xl:flex-row gap-y-5 gap-x-1.5">
        <InterviewProgressChart
          CompletedInterviews={completedInterViews || 0}
          inProgress={(totalInterViews || 0) - (completedInterViews || 0)}
        />
        <SkillsPerformanceChart ChartData={skillsData} />
        <LeaderBoard />
      </div>
    </div>
  );
};

export default DashboardTab;
