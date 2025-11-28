import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Users, Briefcase, CheckCircle } from "lucide-react";
import { CompletedInterviewsTable } from "../hr/completed-interviews-table";
import { ScheduledInterviewsTable } from "../hr/scheduled-interviews-table";

type HRDashboardTabProps = {
  stats: {
    totalUsers: number;
    totalScheduledInterviews: number;
    completedScheduledInterviews: number;
  };
  recentInterviews: {
    id: string;
    name: string;
    user: { name: string | null; email: string };
    updatedAt: Date;
    averageScore: number;
  }[];
  scheduledCandidates: {
    id: string;
    name: string;
    user: { name: string | null; email: string };
    scheduledAt: Date | null;
    expiresAt: Date | null;
  }[];
};

const HRDashboardTab = ({ stats, recentInterviews, scheduledCandidates }: HRDashboardTabProps) => {
  const statCards = [
    {
      title: "Registered Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6" />,
      accent: "from-indigo-500/20 to-indigo-500/5",
      pill: "bg-indigo-500/10 text-indigo-600",
    },
    {
      title: "Scheduled Interviews",
      value: stats.totalScheduledInterviews,
      icon: <Briefcase className="w-6 h-6" />,
      accent: "from-sky-500/20 to-sky-500/5",
      pill: "bg-sky-500/10 text-sky-600",
    },
    {
      title: "Completed Interviews",
      value: stats.completedScheduledInterviews,
      icon: <CheckCircle className="w-6 h-6" />,
      accent: "from-emerald-500/20 to-emerald-500/5",
      pill: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="relative overflow-hidden bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
            <div className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${card.pill}`}>
                    {card.icon}
                    <span>{card.title}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-medium text-gray-800">
                    {card.value.toLocaleString()}
                  </div>
                </div>
                <div className="mt-3 text-xs text-dark/60">
                  {card.title === "Completed Interviews"
                    ? "Interviews finalized with generated feedback"
                    : card.title === "Scheduled Interviews"
                    ? "Interviews planned and shared with candidates"
                    : "Total candidates registered on the platform"}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      
      <CompletedInterviewsTable data={recentInterviews} />
      
      <ScheduledInterviewsTable data={scheduledCandidates} />
    </div>
  );
};

export default HRDashboardTab;
