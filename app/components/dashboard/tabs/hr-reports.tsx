'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../ui/input'
import { Card, CardHeader, CardContent } from '../../ui/card'
import DashboardTabHeader from '../dashboard-tab-header'
import { InterviewHistoryTable } from '../interview-history-table'

const FetchCandidateReports = async () => {
  const res = await fetch(`/api/interview/reports/all`);
  const data = await res.json();
  return data;
};

const HRReportsTab = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const queryResult = useQuery({
    queryKey: ['reports', 'all'],
    queryFn: FetchCandidateReports,
  });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardTabHeader currentTab='hr_reports' />
      <Card className="flex border-none h-full gap-0 bg-[#c1cbef] z-10 pt-0 px-0 rounded-4xl pb-0 w-full">
        <CardHeader className="flex py-4 justify-end flex-row">
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Reports"
            className='p-5 bg-white rounded-full text-sm max-w-sm active:outline-none active:ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0'
          />
        </CardHeader>
        <CardContent className="w-full h-full py-0 px-0">
          <InterviewHistoryTable globalFilterValue={globalFilter} query={queryResult} />
        </CardContent>
      </Card>
    </div>
  )
}

export default HRReportsTab
