"use client"
import React from 'react'
import CreateInterviewForm from '../create-interview-form'
import Image from "next/image";
import ScheduledInterviewsTable from '../scheduled-interviews-table';
import { useSession } from 'next-auth/react';

const CreateInterviewTab = () => {
  const session = useSession();
  const isHR = session?.data?.user?.role === 'HR';
  return (
    <div className="flex flex-col gap-6 w-full">
      {isHR && <ScheduledInterviewsTable />}
      <div className="flex items-center bg-white/60 z-10 p-5 rounded-4xl flex-1 w-full gap-10 justify-around">
        <CreateInterviewForm />
        <Image src={"typing-bro.svg"} className='hidden lg:block z-100 w-full min-w-xs max-w-md ' height={360} width={360} alt='typing'></Image>
      </div>
    </div>
  )
}

export default CreateInterviewTab