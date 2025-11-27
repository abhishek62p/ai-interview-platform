import React from 'react'
import Image from "next/image";

const ShowcaseBanner2 = () => {
    return (
        <article className="bg-gray-100  h-full relative flex flex-col lg:flex-row items-center justify-between p-10 mt-20 mb-20 rounded-[45px] gap-10">
            <section className="flex flex-col gap-6 items-center xl:items-baseline xl:max-w-[70%]">
                <h3 className="text-3xl sm:text-4xl text-center md:text-left font-semibold text-black">
                    Smarter Practice. Sharper Performance.
                </h3>
                <p className="text-base text-center xl:text-left sm:text-lg text-gray-700 leading-relaxed">
                    Whether you're preparing for behavioral, technical, or niche interviews,
                    <strong> AI Mock Interview </strong> adapts to your needs. Get real-time, tailored feedback to improve your delivery, boost your confidence, and master every question. Ready to level up your interview game? Try it today and feel the difference.
                </p>
            </section>
            <Image
                src="/banner-img2.svg"
                height={200}
                width={400}
                className="object-contain -translate-x-1/2 left-[85%] hidden xl:block absolute w-[380px] h-auto"
                alt="Interview preparation illustration"
            />

        </article>
    )
}

export default ShowcaseBanner2