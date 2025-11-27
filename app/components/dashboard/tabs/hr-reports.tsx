'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../ui/input'
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
      <div className='flex flex-col gap-4'>
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search Reports"
          className='max-w-md'
        />
        <InterviewHistoryTable globalFilterValue={globalFilter} query={queryResult} />
      </div>
    </div>
  )
}

export default HRReportsTab
