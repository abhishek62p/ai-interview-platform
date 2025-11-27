'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { useSession } from 'next-auth/react'


const candidateTabItems = [
    { value: "Dashboard", key: "dashboard" },
    { value: "Mock Interviews", key: "mock_interviews" },
    { value: "Create Interview", key: "create_interview" },
    { value: "Interview History", key: "interview_history" },
];

const hrTabItems = [
    { value: "Dashboard", key: "dashboard" },
    { value: "All Users", key: "hr_users" },
    { value: "Schedule Interview", key: "hr_schedule" },
    { value: "Candidate Reports", key: "hr_reports" },
];



const TabBar = () => {
    const session = useSession();
    const isHR = session?.data?.user?.role === 'HR';
    const tabItems = isHR ? hrTabItems : candidateTabItems;

    return (
        <TabsList className='gap-2.5 px-1 bg-white py-6 rounded-r-full rounded-l-full'>
            {
                tabItems.map((item, index) => <TabsTrigger className='py-5 text-sm px-3 duration-300 rounded-full hover:scale-105 hover:bg-[#e7e9fb]' key={index} value={item.key}>{item.value}</TabsTrigger>)
            }
        </TabsList>

    )
}

export default TabBar