import React from 'react'


const containerItems = [
    {
        head: "Master Your",
        subhead: "Responses.",
        content: "Get precise, AI-driven feedback to sharpen your answers and make a lasting impression.",
        bg: "gray",
        textbg: "blue-200"
    },
    {
        head: "Communicate with",
        subhead: "Confidence.",
        content: "AI-guided coaching helps you eliminate filler words and awkward pauses for smooth, professional delivery.",
        bg: "blue-200",
        textbg: "white"

    },
    {
        head: "Practice Real",
        subhead: "Scenarios.",
        content: "Simulate real interview settings so you feel calm, confident, and prepared when it matters most.",
        bg: "black",
        textbg: "white"


    },
    {
        head: "Refine Your",
        subhead: "Delivery.",
        content: "Improve tone, pace, and clarity with detailed feedback tailored to your unique speaking style.",
        bg: "gray",
        textbg: "blue-200"

    },
    {
        head: "Get Instant",
        subhead: "Insights.",
        content: "Receive real-time suggestions and scoring to track your progress and stay interview-ready.",
        bg: "blue-200",
        textbg: "white",
    },
    {
        head: "Ace Any",
        subhead: "Interview.",
        content: "From behavioral to technical interviews, practice across formats and industries with intelligent support.",
        bg: "black",
        textbg: "white"

    }
];


const ShowCaseBanner1 = () => {
    return (<>
        <article className=' pt-0 md:pt-10 pb-10'>
            <section className='flex flex-col md:flex-row justify-items-start gap-10 pt-12 pb-12 items-center'>
                <h3 className='w-fit blue-head text-center sm:text-left px-4 text-2xl sm:text-4xl'>Unlock Your Interview Success</h3>
                <p className='max-w-2/3 text-center'>Transform your interview skills with AI-driven mock interviews that mimic
                    real-world scenarios, helping you refine answers, eliminate mistakes, and boost confidence like
                    never before.</p>
            </section>
            <section className='grid md:grid-cols-2 grid-cols-1 gap-10 items-center'>
                {
                    containerItems.map((item, index) => {
                        return <div key={index} className={`bg-${item.bg} min-h-[260px]  w-full  flex flex-col gap-8 justify-items-start justify-around border-[1px] border-black border-b-8 p-10 rounded-4xl`}>
                            <h3 className="flex flex-col col-span-2 lg:col-span-1">
                                <span className={`w-[fit-content] bg-${item.textbg} px-1.5 py-0.5 text-2xl rounded-sm`}>{item.head}</span>
                                <span className={`w-[fit-content] bg-${item.textbg} px-1.5 py-0.5 text-2xl rounded-sm`}>{item.subhead}</span>
                            </h3>
                            <p className={`text-md text-base ${item.bg == "black" ? "text-gray" : "text-dark"} leading-relaxed align-bottom`}>
                                {item.content}
                            </p>
                        </div>
                    })
                }
            </section>
        </article>
    </>

    )
}

export default ShowCaseBanner1