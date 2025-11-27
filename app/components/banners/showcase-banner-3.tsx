"use client";


import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import Image from "next/image";


const interviewTips = [
    {
        head: "Overcome Interview Anxiety",
        subhead: "Nerves can cloud your thinking, causing hesitation, rambling, or forgetting key points. You want to feel calm and confident, not stressed under pressure. Our AI mock interviews simulate real job interview scenarios, giving you safe, repeatable practice to build composure and ace the real thing."
    },
    {
        head: "Master Unpredictable Questions",
        subhead: "Curveball questions, behavioral scenarios, or technical challenges can catch even the most prepared candidates off guard. You need to think on your feet and impress. With AI mock interviews, you’ll face tough, realistic questions and get instant feedback to sharpen your responses—ensuring you’re ready for anything."
    },
    {
        head: "Get the Feedback You Deserve",
        subhead: "Traditional practice often leaves you guessing where to improve—no constructive insights, just uncertainty. You want clarity on your strengths and weaknesses to stand out. Our AI mock interviews provide personalized, real-time feedback, helping you refine your delivery and showcase your best self to hiring managers."
    },
    {
        head: "Unlock Unlimited Practice Opportunities",
        subhead: "Scheduling mock interviews with friends or mentors can be tricky—conflicts, availability, and inconsistent feedback make it hard to prepare. You want reliable, high-quality practice on your terms. With AI mock interviews, practice anytime, anywhere, at your pace, so you’re always interview-ready."
    },
    {
        head: "Showcase Your Strengths with Confidence",
        subhead: "Many candidates struggle to highlight their achievements and skills in a way that resonates with employers. You want to stand out and leave a lasting impression. AI mock interviews help you craft compelling narratives, eliminate filler words, and project confidence—ensuring you shine in every job interview."
    }
];


const ShowcaseBanner3 = () => {

    const [selected, setSelected] = useState<Record<string, boolean>>({});



    const selectAccordion = (id: string) => {
        setSelected((prev) => {

            if (prev[id]) {
                return {
                    ...prev,
                    [id]: !prev[id]
                }
            }

            for (const key in prev) {
                prev[key] = false;
            }

            return {
                ...prev,
                [id]: !prev[id]
            }

        });
    };

    return (
        <article className='pb-10'>
            <section className='flex flex-col md:flex-row justify-items-start gap-10 pt-12 pb-12 items-center'>
                <h3 className='w-fit blue-head text-center sm:text-left px-4 text-2xl sm:text-4xl'>How AI Mock Interviews Can Help You Succeed
                </h3>
                <p className='max-w-2/3'>Stop feeling unprepared and anxious. Discover how AI-powered mock interviews help you ace your next job interview with confidence.</p>
            </section>
            <section>
                <Accordion type="single" className='flex flex-col gap-10' collapsible>
                    {
                        interviewTips.map((item, index) => {
                            return <AccordionItem className='border-0' onClick={() => selectAccordion(index.toString())} key={index} value={`item-${index}`}>
                                <AccordionTrigger className={` transition-all duration-400 border-[1px]  ${selected[index.toString()] ? "border-black  rounded-[45px] border-2 rounded-b-none border-b-0 bg-blue-200 " : "bg-gray  rounded-[45px]  border-b-8 border-black "}  items-center overflow-hidden  h-[160px] ${index % 2 ? "justify-end" : "justify-start"}  p-10 w-full `}>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-6xl'>0{index + 1}</span>
                                        {item.head}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className={`bg-blue-200 p-5 rounded-[45px] border-[1px] border-black ${selected[index.toString()] && "border-b-8 rounded-none rounded-b-[45px]"}`}>
                                    {item.subhead}
                                </AccordionContent>
                            </AccordionItem>
                        })
                    }

                </Accordion>



            </section>
        </article>
    )
}

export default ShowcaseBanner3