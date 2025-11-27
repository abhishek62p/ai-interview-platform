import React from 'react'
import Image from "next/image";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button';

const InterviewCard = () => {
    return (
        <Card className='bg-gradient-to-b pt-0 from-[#1A1C20] min-h-[330px] to-[#08090D] max-w-xs '>
            <CardHeader className=' text-white flex relative '>
                <CardTitle className='absolute top-0 rounded-tr-2xl font-semibold right-0 p-2.5 rounded-bl-2xl bg-[#24273A]'>Techincal</CardTitle>
                <div className='bg-gradient-to-b from-[#CAC5FE] mt-10 to-[#4e71c8] h-[80px] w-[80px] justify-center rounded-full flex items-center'>
                    <span className='text-[#0d1137] text-[25px] font-bold'>94%</span>
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-2.5'>
                <span className='text-white font-[600] text-[20px]'>Frontend Dev Interview</span>
                <span className='text-[#D6E0FF] flex items-center gap-1 flex-row'>
                    <Image className='bg-[#1A1C2A]' src={"/calendar.png"} height={20} width={20} alt='react'></Image>
                    Feb 28, 2025
                </span>
                <span className='text-[#D6E0FF] line-clamp-3'>This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive, vague, or outright negative, making it more</span>
            </CardContent>
            <CardFooter className='flex items-center justify-between flex-row'>
                <span className='flex flex-row items-center'>
                    <Image className='bg-[#1A1C2A] p-1.5 rounded-full -ml-1' src={"/react.png"} height={40} width={40} alt='react'></Image>
                    <Image className='bg-[#1A1C2A] p-1.5 rounded-full -ml-1' src={"/tailwind.png"} height={40} width={40} alt='react'></Image>
                </span>
                <Button className='primary-button'>View interview</Button>
            </CardFooter>
        </Card>

    )
}

export default InterviewCard