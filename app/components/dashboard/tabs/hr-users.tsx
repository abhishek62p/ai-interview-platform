'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../ui/input'
import { RegisteredUsersTable } from '../hr/registered-users-table'
import DashboardTabHeader from '../dashboard-tab-header'
import { Card, CardContent, CardHeader } from '../../ui/card'

const FetchAllUsers = async () => {
  const res = await fetch(`/api/users/getall`);
  const data = await res.json();
  return data;
};

const HRUsersTab = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const queryResult = useQuery({
    queryKey: ['users', 'all'],
    queryFn: FetchAllUsers,
  });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardTabHeader currentTab='hr_users' />
      <Card className="flex border-none h-full gap-0 bg-[#c1cbef] z-10 pt-0 px-0 rounded-4xl pb-0 w-full">
        <CardHeader className="flex py-4 justify-end flex-row">
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Users"
            className='p-5 bg-white rounded-full text-sm max-w-sm active:outline-none active:ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0'
          />
        </CardHeader>
        <CardContent className="w-full h-full py-0 px-0">
          <RegisteredUsersTable globalFilterValue={globalFilter} query={queryResult} />
        </CardContent>
      </Card>
    </div>
  )
}

export default HRUsersTab
